const Course = require("../Models/course.model");
const User = require("../Models/user.model");
const Order = require("../Models/order.model");
const uploadOnCloudinary = require("../Utils/cloudinary");



module.exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      keywords,
      topics,
      level,
      language,
      isPublished,
      price,
      discount
    } = req.body;

    let thumbnailUrl = "";
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (uploadResult) {
        thumbnailUrl = uploadResult.secure_url;
      }
    } else if (req.body.thumbnail) {
      thumbnailUrl = req.body.thumbnail;
    }

    if (!thumbnailUrl) {
      return res.status(400).json({ message: "Thumbnail is required" });
    }

    const course = await Course.create({
      instructorId: req.user._id,
      title,
      description,
      thumbnail: thumbnailUrl,
      requirements: requirements ? (typeof requirements === 'string' ? JSON.parse(requirements) : requirements) : [],
      keywords: keywords ? (typeof keywords === 'string' ? JSON.parse(keywords) : keywords) : [],
      topics: topics ? (typeof topics === 'string' ? JSON.parse(topics) : topics) : [],
      level,
      language,
      isPublished,
      price,
      discount
    });

    return res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating course"
    });
  }
};



module.exports.getAllPublishedCourses = async (req, res) => {

  try {
    const courses = await Course.find({ isPublished: true }).populate(
      "instructorId",
      "name"
    );

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        message: "Courses not found"
      });
    }

    return res.status(200).json({
      message: "Courses found successfully",
      totalCourses: courses.length,
      courses
    });
  } catch (error) {
    console.error("Error fetching published courses:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching courses"
    });
  }
};


module.exports.getInstructorAllCoursesWithOrders = async (req, res) => {
  try {
    // Fetch all published courses for this instructor
    const courses = await Course.find({ instructorId: req.user._id })
      .populate("instructorId", "name")
      .populate("reviews.userId", "name");

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        message: "Courses not found"
      });
    }

    // Fetch all orders related to these courses
    const courseIds = courses.map(course => course._id);

    const orders = await Order.find({ courses: { $in: courseIds } })
      .populate("userId", "name") // populate student/user name
      .populate("courses", "title"); // populate course title

    // Merge orders with corresponding course
    const coursesWithOrders = courses.map(course => {
      const relatedOrders = orders
        .filter(order => order.courses.some(c => c._id.equals(course._id)))
        .map(order => ({
          studentName: order.userId.name,
          paymentId: order.paymentId,
          status: order.status,
          amount: order.amount,
          orderedAt: order.createdAt,
        }));

      return {
        ...course.toObject(),
        orders: relatedOrders
      };
    });

    return res.status(200).json({
      message: "Courses with orders fetched successfully",
      totalCourses: courses.length,
      courses: coursesWithOrders
    });

  } catch (error) {
    console.error("Error fetching courses with orders:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching courses with orders"
    });
  }
};


// get course detail by its id
module.exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "ID is required!"
      });
    }

    const course = await Course.findById(id)
      .populate("instructorId", "name")
      .populate("reviews.userId", "name avatar");

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course found successfully",
      course
    });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching course"
    });
  }
};


// add section in the course by instructor
module.exports.addSessionInCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required!"
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to modify this course"
      });
    }

    const newSection = {
      title: title,
      lectureCount: 0,
      duration: 0,
      lectures: []
    };

    course.content.sections.push(newSection);

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      course
    });
  } catch (error) {
    console.error("Error adding section:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating section"
    });
  }
};


// add lecture in a existing section in the course by instructor
module.exports.addLectureInSection = async (req, res) => {
  try {
    const { id, sectionId } = req.params;
    const { title, type, url, duration, isPreview } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        message: "Title and type are required!"
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to modify this course"
      });
    }

    const section = course.content.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Section not found"
      });
    }

    const newLecture = {
      title: title,
      type: type,
      url: url || "",
      duration: duration || 0,
      isPreview: isPreview || false
    };

    section.lectures.push(newLecture);

    section.lectureCount = section.lectures.length;

    section.duration = section.lectures.reduce((total, lecture) => {
      return total + (lecture.duration || 0);
    }, 0);

    course.content.totalDuration = course.content.sections.reduce(
      (total, sec) => {
        return total + (sec.duration || 0);
      },
      0
    );

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Lecture added successfully",
      course
    });
  } catch (error) {
    console.error("Error adding lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding lecture"
    });
  }
};

//user get all its cart courses detail using local storage
module.exports.getAllCartCourse = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !ids.length) {
      return res.status(400).json({
        message: "Cart IDs are required"
      });
    }

    const allCarts = await Course.find({
      _id: { $in: ids }
    });

    if (!allCarts.length) {
      return res.status(404).json({
        message: "Courses not found"
      });
    }

    return res.status(200).json({
      message: "Courses found successfully",
      courses: allCarts
    });
  } catch (error) {
    console.error("Error fetching cart courses:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching cart courses"
    });
  }
};

// delete a course by id by instructor
module.exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "ID is required!"
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this course"
      });
    }

    await Course.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Course deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting course"
    });
  }
};

exports.updateBasicInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      language,
      level,
      price,
      discount,
      requirements,
      topics,
      keywords,
      isPublished
    } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this course"
      });
    }

    const updateData = {
      title,
      description,
      language,
      level,
      price,
      discount,
      isPublished,
      requirements: requirements ? (typeof requirements === 'string' ? JSON.parse(requirements) : requirements) : [],
      topics: topics ? (typeof topics === 'string' ? JSON.parse(topics) : topics) : [],
      keywords: keywords ? (typeof keywords === 'string' ? JSON.parse(keywords) : keywords) : []
    };

    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (uploadResult) {
        updateData.thumbnail = uploadResult.secure_url;
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Basic info updated successfully",
      course: updatedCourse
    });
  } catch (error) {
    console.error("Error updating basic info:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating course"
    });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if user is enrolled
    const isEnrolled = course.enrolledStudents.some(
      (studentId) => studentId.toString() === req.user._id.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({ message: "Only enrolled students can review this course" });
    }

    // Check if user already reviewed
    const alreadyReviewed = course.reviews.find(
      (rev) => rev.userId.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this course" });
    }

    const review = {
      userId: req.user._id,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    course.reviews.push(review);

    const totalRating = course.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    course.rating = totalRating / course.reviews.length;
    course.ratingCount = course.reviews.length;

    await course.save();

    res.status(201).json({ message: "Review added", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to add review", error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const review = course.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const isReviewer = review.userId.toString() === req.user._id.toString();
    const isCourseInstructor = course.instructorId.toString() === req.user._id.toString() && req.user.role === "instructor";
    const isAdmin = req.user.role === "admin";

    if (!isReviewer && !isCourseInstructor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    course.reviews.pull(reviewId);

    if (course.reviews.length > 0) {
      const totalRating = course.reviews.reduce((acc, curr) => acc + curr.rating, 0);
      course.rating = totalRating / course.reviews.length;
    } else {
      course.rating = 0;
    }
    course.ratingCount = course.reviews.length;

    await course.save();

    res.status(200).json({ message: "Review deleted", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review", error: error.message });
  }
};