import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { FaRegPlayCircle, FaStar, FaUsers } from "react-icons/fa";
import { IoIosArrowDown, IoMdTime } from "react-icons/io";
import { LuBadgeCheck } from "react-icons/lu";
import { MdLanguage, MdLiveTv } from "react-icons/md";
import { calculateDiscountedPrice } from "../../Utils/pricing";
import CheckoutButton from "../Common/CheckoutButton";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Contexts/userContext";

const Course = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [preview, setPreview] = useState("");
  const [allExpand, setAllExpand] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const isEnrolled = course?.enrolledStudents?.some(
    (studentId) => studentId.toString() === user?._id?.toString()
  );

  const addToCart = () => {
    const carts = JSON.parse(localStorage.getItem("ademyCart")) || [];
    if (!carts.includes(course?._id)) carts.push(course?._id);
    localStorage.setItem("ademyCart", JSON.stringify(carts));
    alert("add to cart");
  };

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/v1/courses/course/${id}`);
      setCourse(res.data.course);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/v1/reviews/add`, { ...newReview, courseId: id });
      setNewReview({ rating: 5, comment: "" });
      fetchCourse();
      alert("Review added!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add review");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`/api/v1/reviews/delete/${reviewId}`);
      fetchCourse();
      alert("Review deleted!");
    } catch (error) {
      alert("Failed to delete review");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const lectures =
    course?.content?.sections?.reduce(
      (t, i) => t + (i?.lectures?.length || 0),
      0
    ) || 0;

  return (
    <section className="w-full bg-white">
      <div className="relative bg-[#16161d] text-white px-12 py-10 flex gap-8 max-md:flex-col max-md:px-6">
        <div className="w-2/3 space-y-3 max-md:w-full">
          <h2 className="text-3xl font-bold max-md:text-xl">{course?.title}</h2>

          <div className="flex flex-wrap gap-2">
            {course?.keywords?.map((word, i) => (
              <p key={i} className="text-lg text-gray-300 max-md:text-sm">
                {word} |
              </p>
            ))}
          </div>

          <p className="text-sm">
            Created by{" "}
            <span className="font-medium">{course?.instructorId?.name}</span>
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <IoMdTime /> {new Date(course?.updatedAt).toDateString()}
            </span>
            <span className="flex items-center gap-1">
              <MdLanguage /> {course?.language}
            </span>
          </div>

          <div
            className="absolute w-3/5 -bottom-16 left-12 bg-white text-black rounded-xl shadow-lg 
                flex items-center overflow-hidden
                max-md:static max-md:w-full max-md:mt-6 max-md:flex-col max-md:gap-4"
          >
            <div className="bg-[#5022c3] text-white px-8 py-5 flex flex-col items-center w-full md:w-auto">
              <LuBadgeCheck className="text-3xl" />
              <span className="font-semibold mt-1">Premium</span>
            </div>

            <p className="flex-1 px-6 text-sm max-md:text-center">
              Access 26,000+ courses with an Ademy plan.{" "}
              <span className="text-[#5022c3] font-semibold">
                See Plans & Pricing
              </span>
            </p>

            <div
              className="px-6 text-center 
                  md:border-l md:border-r 
                  max-md:border-t max-md:border-b max-md:py-4 w-full md:w-auto"
            >
              <h4 className="font-bold text-xl">{course?.rating}</h4>
              <div className="flex justify-center text-yellow-400">
                {Array(4)
                  .fill()
                  .map((_, i) => (
                    <FaStar key={i} />
                  ))}
              </div>
              <p className="text-xs underline">{course?.ratingCount} ratings</p>
            </div>

            <div className="px-6 text-center pb-4 md:pb-0">
              <FaUsers className="mx-auto" />
              <h4 className="font-bold">{course?.studentsEnrolled}</h4>
              <p className="text-sm">learners</p>
            </div>
          </div>
        </div>

        <div className="w-1/3 bg-white rounded-xl overflow-hidden shadow-lg max-md:w-full">
          <img src={course?.thumbnail} className="h-64 w-full object-cover" />
        </div>
      </div>

      <div className="flex px-12 gap-8 pt-24 max-md:flex-col max-md:px-6">
        <div className="w-2/3 space-y-8 max-md:w-full">
          <div>
            <h2 className="text-2xl font-bold mb-2">Description</h2>
            <p className="text-gray-700">{course?.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Requirements</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {course?.requirements?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold">Course content</h2>

            <div className="flex justify-between text-sm text-gray-600 my-2">
              <p>
                {course?.content?.sections?.length} sections • {lectures}{" "}
                lectures • {course?.content?.totalDuration}m
              </p>
              <button
                onClick={() => setAllExpand(!allExpand)}
                className="font-semibold text-[#6d28d2]"
              >
                {allExpand ? "Close all sections" : "Expand all sections"}
              </button>
            </div>

            {course?.content?.sections?.map((item, i) => (
              <div key={i} className="bg-[#f6f7f9] rounded-md px-6 py-4 mb-2">
                <div
                  className="flex flex-col md:flex-row items-center justify-between cursor-pointer"
                  onClick={() =>
                    setPreview(preview === item._id ? "" : item._id)
                  }
                >
                  <h3 className="font-semibold flex items-center gap-3">
                    <IoIosArrowDown
                      className={`transition-transform ${preview === item._id ? "rotate-180" : ""
                        }`}
                    />
                    {item.title}
                  </h3>
                  <span className="text-sm">
                    {item.lectures.length} lectures •{" "}
                    {item.lectures.reduce((t, l) => t + (l.duration || 0), 0)}m
                  </span>
                </div>

                {(allExpand || preview === item._id) &&
                  item.lectures.map((lecture, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-3 flex justify-between items-center bg-gray-200 mt-2 rounded-md"
                    >
                      <h4 className="flex items-center gap-3">
                        <MdLiveTv />
                        {lecture.title}
                      </h4>
                      <span className="flex items-center gap-2 text-sm text-[#6d28d2]">
                        {(lecture.isPreview || isEnrolled) && (
                          <button
                            onClick={() => setCurrentVideo(lecture)}
                            className="flex items-center gap-1"
                          >
                            <FaRegPlayCircle />
                            {lecture.isPreview && !isEnrolled
                              ? "Preview"
                              : "Play"}
                          </button>
                        )}
                        {lecture.duration} min
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Student Feedback</h2>

            {/* Review Form */}
            {isEnrolled ? (
              <form onSubmit={submitReview} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="font-semibold mb-4 text-lg">Leave a Review</h3>
                <div className="flex gap-4 mb-4 items-center">
                  <p className="text-sm font-medium">Rating:</p>
                  <div className="flex text-yellow-400 text-xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        {star <= newReview.rating ? <FaStar /> : <FaStar className="text-gray-300" />}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience..."
                  className="w-full p-4 border rounded-lg mb-4 resize-none h-24 focus:ring-2 focus:ring-[#6d28d2] focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#6d28d2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#5022c3] transition-colors"
                >
                  Submit Review
                </button>
              </form>
            ) : user ? (
              <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <p className="text-blue-700 font-medium">You must be enrolled in this course to leave a review.</p>
                <p className="text-blue-600 text-sm mt-1">Purchase the course to share your feedback with other students.</p>
              </div>
            ) : (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <p className="text-gray-600 font-medium">Please log in to leave a review.</p>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {course?.reviews?.length > 0 ? (
                course.reviews.map((review, i) => (
                  <div key={i} className="pb-6 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#6d28d2] text-white rounded-full flex items-center justify-center font-bold">
                          {review.userId?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold">{review.userId?.name || "Student"}</p>
                          <div className="flex text-yellow-400 text-sm">
                            {Array(5).fill().map((_, idx) => (
                              <FaStar key={idx} className={idx < review.rating ? "text-yellow-400" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-gray-700 flex-1">{review.comment}</p>
                      {(user?._id === review.userId || (typeof review.userId === 'object' && user?._id === review.userId._id)) && (
                        <button
                          onClick={() => deleteReview(review._id)}
                          className="text-red-500 text-sm font-medium hover:underline ml-4"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-1/3 max-md:w-full">
          <div className="sticky top-24">
            {currentVideo ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-[#16161d] text-white px-4 py-3 flex justify-between">
                  <h3 className="font-semibold">{currentVideo.title}</h3>
                  <button onClick={() => setCurrentVideo(null)}>×</button>
                </div>
                <div className="aspect-video bg-black">
                  <video
                    src={currentVideo.url}
                    controls
                    autoPlay
                    className="w-full h-full"
                  />
                </div>
              </div>
            ) : isEnrolled ? (
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                {" "}
                <div className="text-center py-4">
                  {" "}
                  <LuBadgeCheck className="text-5xl text-green-600 mx-auto mb-3" />{" "}
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {" "}
                    You're Enrolled!{" "}
                  </h3>{" "}
                  <p className="text-gray-600">
                    {" "}
                    Select any lecture to start learning{" "}
                  </p>{" "}
                </div>{" "}
                <div className="border-t pt-4 space-y-2">
                  {" "}
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    {" "}
                    <LuBadgeCheck className="text-[#6d28d2]" /> Full Lifetime
                    Access{" "}
                  </p>{" "}
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    {" "}
                    <MdLiveTv className="text-[#6d28d2]" /> {lectures} Lectures{" "}
                  </p>{" "}
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    {" "}
                    <IoMdTime className="text-[#6d28d2]" />{" "}
                    {course?.content?.totalDuration}m Total Duration{" "}
                  </p>{" "}
                </div>{" "}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-bold">
                    ${calculateDiscountedPrice(course?.price, course?.discount).toFixed(2)}
                  </h3>
                  <del className="text-gray-400">${course?.price}</del>
                  <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded text-sm">
                    {course?.discount}% off
                  </span>
                </div>

                <button
                  onClick={addToCart}
                  className="w-full bg-[#6d28d2] text-white font-bold py-3 rounded-lg"
                >
                  Go to cart
                </button>

                <CheckoutButton
                  cartIds={[id]}
                  label="Buy now"
                  className="w-full border-2 border-gray-900 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-50 bg-white"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Course;
