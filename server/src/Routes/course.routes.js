const express = require("express");
const { createCourse, getAllPublishedCourses, getCourseById, addSessionInCourse, addLectureInSection, getAllCartCourse, deleteCourse, updateBasicInfo, getInstructorAllCoursesWithOrders, addReview, deleteReview } = require("../Controllers/course.controller");
const { isUserLogin, isInstructorLogin } = require("../Middlewares/auth.middleware");
const upload = require("../Middlewares/multer.middleware");

const router = express.Router();

router.get("/", getAllPublishedCourses);
router.post("/", isInstructorLogin, upload.single("thumbnail"), createCourse);

router.get("/me", isInstructorLogin, getInstructorAllCoursesWithOrders);
router.post("/batch", isUserLogin, getAllCartCourse);

router.get("/:id", getCourseById);
router.patch("/:id", isInstructorLogin, upload.single("thumbnail"), updateBasicInfo);
router.delete("/:id", isInstructorLogin, deleteCourse);

router.post("/:id/sections", isInstructorLogin, addSessionInCourse);
router.post("/:id/sections/:sectionId/lectures", isInstructorLogin, addLectureInSection);

router.post("/:id/reviews", isUserLogin, addReview);
router.delete("/:id/reviews/:reviewId", isUserLogin, deleteReview);

module.exports = router;
