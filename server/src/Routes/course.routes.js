const express = require("express");
const { createCourse, getAllPublishedCourses, getCourseById, addSessionInCourse, addLectureInSection, getAllCartCourse, deleteCourse, updateBasicInfo, getInstructorAllCoursesWithOrders, addReview, deleteReview } = require("../Controllers/course.controller");
const { isUserLogin, isInstructorLogin } = require("../Middlewares/auth.middleware");
const upload = require("../Middlewares/multer.middleware");

const router = express.Router();

router.post("/create-new", isInstructorLogin, upload.single("thumbnail"), createCourse);

router.get("/get-all-courses", getAllPublishedCourses);
router.get("/course/:id", getCourseById);
router.put("/add-section-course/:id", isInstructorLogin, addSessionInCourse);
router.put("/add-lecture-section/:id/:sectionId", isInstructorLogin, addLectureInSection)

//instructor get all its courses
router.get("/get-courses", isInstructorLogin, getInstructorAllCoursesWithOrders)
// get all cart courses
router.get("/get-carts-courses", isUserLogin, getAllCartCourse);

// delete a course
router.delete("/delete/:id", isInstructorLogin, deleteCourse);
//edit basic info of course--
router.put('/update/:id', isInstructorLogin, upload.single("thumbnail"), updateBasicInfo);

// Review routes
router.post("/:id/review", isUserLogin, addReview);
router.delete("/:id/review/:reviewId", isUserLogin, deleteReview);

module.exports = router;