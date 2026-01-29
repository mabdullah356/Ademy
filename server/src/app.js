const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

// Stripe webhook controller
const { stripeWebhook } = require("./Controllers/order.controller");

app.post(
  "/api/v1/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const userRoutes = require("./Routes/user.routes");
const courseRoutes = require("./Routes/course.routes");
const orderRoutes = require("./Routes/order.routes");
const reviewRoutes = require("./Routes/review.routes");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/stripe", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);

const errorHandler = require("./Middlewares/errorHandler");
app.use(errorHandler);

module.exports = app;
