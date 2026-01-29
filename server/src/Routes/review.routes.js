const express = require("express");
const { addReview, deleteReview, getCourseReviews } = require("../Controllers/review.controller");
const { isUserLogin } = require("../Middlewares/auth.middleware");

const router = express.Router();

router.post("/add", isUserLogin, addReview);
router.get("/course/:courseId", getCourseReviews);
router.delete("/delete/:reviewId", isUserLogin, deleteReview);

module.exports = router;
