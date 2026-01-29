const { Review } = require("../Models/review.model");
const Course = require("../Models/course.model");

module.exports.addReview = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body;

        if (!courseId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if user is enrolled
        const isEnrolled = course.enrolledStudents.some(
            (studentId) => studentId.toString() === req.user._id.toString()
        );

        if (!isEnrolled) {
            return res.status(403).json({ message: "Only enrolled students can review this course" });
        }

        // Check if already reviewed
        const alreadyReviewed = await Review.findOne({
            courseId,
            userId: req.user._id
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: "You have already reviewed this course" });
        }

        const review = await Review.create({
            userId: req.user._id,
            courseId,
            rating: Number(rating),
            comment
        });

        // Calculate new average rating
        const allReviews = await Review.find({ courseId });
        const totalRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0);

        course.rating = totalRating / allReviews.length;
        course.ratingCount = allReviews.length;

        // Also update the embedded reviews array for backward compatibility if it exists
        if (course.reviews) {
            course.reviews.push({
                userId: req.user._id,
                courseId: courseId,
                rating: Number(rating),
                comment,
                createdAt: new Date()
            });
        }

        await course.save();

        return res.status(201).json({
            message: "Review added successfully",
            review
        });

    } catch (error) {
        console.error("Error adding review:", error);
        return res.status(500).json({ message: "Server error while adding review" });
    }
};

module.exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const course = await Course.findById(review.courseId);
        if (!course) {
            return res.status(404).json({ message: "Associated course not found" });
        }

        // Auth check: review owner, course instructor, or admin
        const isReviewer = review.userId.toString() === req.user._id.toString();
        const isInstructor = course.instructorId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isReviewer && !isInstructor && !isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await Review.findByIdAndDelete(reviewId);

        // Update course ratings
        const allReviews = await Review.find({ courseId: course._id });
        if (allReviews.length > 0) {
            const totalRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
            course.rating = totalRating / allReviews.length;
        } else {
            course.rating = 0;
        }
        course.ratingCount = allReviews.length;

        // Update embedded reviews if needed (sync)
        if (course.reviews) {
            course.reviews = course.reviews.filter(r => r.userId.toString() !== review.userId.toString());
        }

        await course.save();

        return res.status(200).json({
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting review:", error);
        return res.status(500).json({ message: "Server error while deleting review" });
    }
};

module.exports.getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const reviews = await Review.find({ courseId }).populate("userId", "name avatar");

        return res.status(200).json({
            reviews
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching reviews" });
    }
};
