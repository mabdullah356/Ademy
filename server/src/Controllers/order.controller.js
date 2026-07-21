const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Course = require("../Models/course.model");
const Order = require("../Models/order.model");

// Create Stripe Checkout Session
module.exports.createCheckoutSession = async (req, res) => {
  try {
    const { cartIds } = req.body;

    const courses = await Course.find({ _id: { $in: cartIds } });
    if (!courses || courses.length === 0)
      return res.status(404).json({ message: "No courses found" });

    const lineItems = courses.map((course) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: course.title,
          images: (course.thumbnail && course.thumbnail.length < 2000) ? [course.thumbnail] : [],
        },
        unit_amount: Math.round(course.discountedPrice * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}cancel`,
      metadata: {
        userId: req.user._id.toString(), // from auth middleware
        courseIds: courses.map((c) => c._id).join(","), // comma separated
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stripe checkout failed" });
  }
};

module.exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const { userId, courseIds } = session.metadata;
    const courseIdArray = courseIds.split(",");

    try {
      await Order.create({
        userId,
        courses: courseIdArray,
        amount: session.amount_total, // Store in CENTS consistently
        paymentId: session.payment_intent,
        status: "paid",
      });

      await Course.updateMany(
        {
          _id: { $in: courseIdArray },
          enrolledStudents: { $ne: userId }, // prevent duplicate
        },
        {
          $addToSet: { enrolledStudents: userId },
          $inc: { studentsEnrolled: 1 },
        }
      );

      console.log("Student enrolled into courses");
    } catch (err) {
      console.error("Webhook DB operation failed:", err);
    }
  }

  res.status(200).json({ received: true });
};

// Manual verification fallback for Local Development (when webhook is unreachable)
module.exports.verifySession = async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ message: "Session ID required" });

    // 1. Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // Verify the session belongs to the authenticated user
    if (session.metadata.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to verify this session" });
    }

    // 2. Check if order already exists (to prevent double enrollment)
    const existingOrder = await Order.findOne({ paymentId: session.payment_intent });
    if (existingOrder) {
      return res.status(200).json({ success: true, message: "Already enrolled", order: existingOrder });
    }

    // 3. Extract metadata and create order (Same logic as webhook)
    const { userId, courseIds } = session.metadata;
    const courseIdArray = courseIds.split(",");

    const newOrder = await Order.create({
      userId,
      courses: courseIdArray,
      amount: session.amount_total, // Store in CENTS consistently
      paymentId: session.payment_intent,
      status: "paid",
    });

    await Course.updateMany(
      {
        _id: { $in: courseIdArray },
        enrolledStudents: { $ne: userId },
      },
      {
        $addToSet: { enrolledStudents: userId },
        $inc: { studentsEnrolled: 1 },
      }
    );

    res.status(200).json({ success: true, message: "Enrolled successfully", order: newOrder });

  } catch (error) {
    console.error("Session verification failed:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

module.exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("courses")
      .sort({ createdAt: -1 });

    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Error fetching my orders:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};
