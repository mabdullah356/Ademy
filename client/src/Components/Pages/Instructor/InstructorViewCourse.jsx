import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaUsers,
  FaDollarSign,
  FaStar,
  FaClock,
  FaBook,
  FaVideo,
  FaFileAlt,
  FaQuestionCircle,
  FaTasks,
  FaChartLine,
  FaEdit,
  FaTrash,
  FaPlay,
  FaGlobe,
  FaTag,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";

import Course from "../Course";

const InstructorViewCourse = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [actionDelete, setActionDelete] = useState(false);
  const [previewAsStudent, setPreviewAsStudent] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/v1/courses/${id}`);
      setCourse(res.data.course);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getLectureIcon = (type) => {
    switch (type) {
      case "video":
        return <FaVideo className="text-blue-600" />;
      case "article":
        return <FaFileAlt className="text-green-600" />;
      case "quiz":
        return <FaQuestionCircle className="text-purple-600" />;
      case "exercise":
        return <FaTasks className="text-amber-600" />;
      case "assignment":
        return <FaTasks className="text-red-600" />;
      default:
        return <FaFileAlt className="text-gray-600" />;
    }
  };

  const badgeColors = {
    bestseller: "bg-amber-100 text-amber-800",
    hot: "bg-red-100 text-red-800",
    new: "bg-blue-100 text-blue-800",
    trending: "bg-green-100 text-green-800",
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/api/v1/courses/${id}`);
      alert(res.data.message);
      window.location.href = "/instructor-home";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {previewAsStudent ? (
        <section className="w-full h-full relative bg-white rounded-xl shadow-lg p-4 sm:p-6">
          {/* Close Button */}
          <span
            onClick={() => setPreviewAsStudent(!previewAsStudent)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 cursor-pointer text-gray-500 hover:text-red-500 transition text-xl z-10"
          >
            <RxCross2 />
          </span>

          {/* Header */}
          <div className="mb-4 border-b pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Student Preview
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              View course as an enrolled student
            </p>
          </div>

          {/* Course Preview */}
          <div className="mt-4">
            <Course />
          </div>
        </section>
      ) : (
        <section className="px-3 sm:px-4 md:px-6 lg:px-7 py-4 sm:py-5 min-h-screen bg-gray-50">
          {actionDelete && (
            <section className="fixed sm:absolute top-20 sm:top-2 right-4 sm:right-16 z-50 w-72 sm:w-56 rounded-md border bg-white p-3 shadow-lg">
              {/* Warning text */}
              <p className="mb-2 text-sm text-red-600 font-medium">
                This action cannot be undone
              </p>

              {/* Divider */}
              <hr className="mb-3 border-gray-200" />

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete
                </button>

                <button
                  className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
                  onClick={() => setActionDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </section>
          )}

          {/* Header with Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-900">
                  Course Overview
                </h2>
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${course?.isPublished
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {course?.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Manage and view your course details and performance
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate(`/edit-course/${course?._id}`)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                <FaEdit className="text-sm sm:text-base" />
                <span className="hidden xs:inline">Edit Course</span>
                <span className="xs:hidden">Edit</span>
              </button>
              <button
                onClick={() => setActionDelete(true)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
              >
                <FaTrash className="text-sm sm:text-base" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Course Details */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Course Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative">
                  <img
                    src={course?.thumbnail}
                    alt={course?.title}
                    className="w-full h-40 sm:h-48 md:h-64 object-cover"
                  />
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 flex-wrap justify-end max-w-[60%]">
                    {course?.badges.map((badge) => (
                      <span
                        key={badge}
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${badgeColors[badge]}`}
                      >
                        {badge.charAt(0).toUpperCase() + badge.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
                    <div className="w-full sm:w-auto">
                      <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 mb-2">
                        {course?.title}
                      </h1>
                      <p className="text-sm sm:text-base text-gray-600 mb-2">
                        Created by {course?.instructorId?.name}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-sm sm:text-base">
                        <span className="flex items-center gap-1 text-amber-600 font-semibold">
                          <FaStar className="text-xs sm:text-sm" /> {course?.rating} ({course?.ratingCount})
                        </span>
                        <span className="text-gray-600 flex items-center gap-1">
                          <FaClock className="text-xs sm:text-sm" />{" "}
                          {formatDuration(course?.content?.totalDuration)}
                        </span>
                        <span className="text-gray-600 flex items-center gap-1">
                          <FaGlobe className="text-xs sm:text-sm" /> {course?.language}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        {course?.discount > 0 && (
                          <span className="text-base sm:text-lg text-gray-500 line-through">
                            ${course?.price}
                          </span>
                        )}
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                          $
                          {Math.floor(
                            course?.price * (1 - course?.discount / 100)
                          )}
                        </span>
                      </div>
                      {course?.discount > 0 && (
                        <span className="text-sm sm:text-base text-green-600 font-medium">
                          {course?.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                    {course?.description}
                  </p>

                  {/* Requirements */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 flex items-center gap-2">
                      <FaCheckCircle className="text-sm sm:text-base" /> Requirements
                    </h3>
                    <ul className="space-y-2">
                      {course?.requirements.map((req, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm sm:text-base text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0"></div>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Topics */}
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 flex items-center gap-2">
                      <FaTag className="text-sm sm:text-base" /> Topics Covered
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {course?.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="font-bold text-xl sm:text-2xl text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <FaBook className="text-lg sm:text-xl" /> Course Content
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  {course?.content.sections.map((section, sectionIndex) => (
                    <div
                      key={section._id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedSection(
                            expandedSection === sectionIndex
                              ? null
                              : sectionIndex
                          )
                        }
                        className="w-full p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                      >
                        <div className="text-left flex-1 pr-2">
                          <h4 className="font-bold text-base sm:text-lg text-gray-900 wrap-break-words">
                            Section {sectionIndex + 1}: {section.title}
                          </h4>
                          <div className="flex items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-600 flex-wrap">
                            <span className="flex items-center gap-1">
                              <FaVideo className="text-xs" /> {section.lectureCount} lectures
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="text-xs" /> {formatDuration(section.duration)}
                            </span>
                          </div>
                        </div>
                        {expandedSection === sectionIndex ? (
                          <FaChevronUp className="shrink-0 text-sm sm:text-base" />
                        ) : (
                          <FaChevronDown className="shrink-0 text-sm sm:text-base" />
                        )}
                      </button>

                      {expandedSection === sectionIndex && (
                        <div className="p-3 sm:p-4 border-t border-gray-200">
                          <div className="space-y-2 sm:space-y-3">
                            {section.lectures.map((lecture) => (
                              <div
                                key={lecture._id}
                                className="flex items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 gap-2"
                              >
                                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                  <div className="shrink-0 mt-0.5 sm:mt-0">
                                    {getLectureIcon(lecture.type)}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-medium text-sm sm:text-base text-gray-900 wrap-break-words">
                                      {lecture.title}
                                    </h5>
                                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 flex-wrap mt-1">
                                      <span className="capitalize">
                                        {lecture.type}
                                      </span>
                                      <span className="hidden xs:inline">•</span>
                                      <span>{lecture.duration} min</span>
                                      {lecture.isPreview && (
                                        <>
                                          <span className="hidden xs:inline">•</span>
                                          <span className="text-blue-600 flex items-center gap-1">
                                            <FaPlay className="text-xs" /> Free preview
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-gray-900">
                        Content Summary
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Total course material overview
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {course?.content.sections.length} sections
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {course?.content.sections.reduce(
                          (total, section) => total + section.lectureCount,
                          0
                        )}{" "}
                        lectures
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Reviews */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="font-bold text-xl sm:text-2xl text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <FaStar className="text-yellow-400" /> Student Reviews
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  {course?.reviews?.length > 0 ? (
                    course.reviews.map((review, i) => (
                      <div key={i} className="pb-4 sm:pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                              {review.userId?.name?.charAt(0).toUpperCase() || "S"}
                            </div>
                            <div>
                              <p className="font-semibold text-sm sm:text-base text-gray-900">{review.userId?.name || "Student"}</p>
                              <div className="flex text-yellow-400 text-xs sm:text-sm">
                                {Array(5).fill().map((_, idx) => (
                                  <FaStar key={idx} className={idx < review.rating ? "text-yellow-400" : "text-gray-300"} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <p className="text-[10px] sm:text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                            <button
                              onClick={async () => {
                                if (window.confirm("Are you sure you want to delete this review?")) {
                                  try {
                                    await axios.delete(`/api/v1/reviews/${review._id}`);
                                    fetchCourse();
                                    alert("Review deleted successfully");
                                  } catch (error) {
                                    alert("Failed to delete review");
                                  }
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-1 sm:p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Review"
                            >
                              <FaTrash className="text-xs sm:text-sm" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed pl-10 sm:pl-13">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FaStar className="text-gray-300 text-3xl sm:text-4xl mx-auto mb-2" />
                      <p className="text-gray-500 text-sm sm:text-base">No reviews yet for this course.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Actions */}
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">
                  Course Statistics
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                        <FaUsers className="text-blue-600 text-sm sm:text-base" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Students Enrolled
                        </p>
                        <p className="font-bold text-lg sm:text-xl text-gray-900">
                          {course?.studentsEnrolled.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                        <FaDollarSign className="text-green-600 text-sm sm:text-base" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
                        <p className="font-bold text-lg sm:text-xl text-gray-900">
                          $
                          {(
                            course?.studentsEnrolled *
                            Math.floor(
                              course?.price * (1 - course?.discount / 100)
                            )
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                        <FaStar className="text-purple-600 text-sm sm:text-base" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-600">Average Rating</p>
                        <p className="font-bold text-lg sm:text-xl text-gray-900">
                          {course?.rating}/5
                        </p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">
                      ({course?.ratingCount})
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">
                  Course Information
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm sm:text-base">
                    <span className="text-gray-600">Level</span>
                    <span className="font-medium capitalize">
                      {course?.level}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm sm:text-base">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium">{course?.language}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm sm:text-base">
                    <span className="text-gray-600">Created</span>
                    <span className="font-medium">
                      {new Date(course?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm sm:text-base">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium">
                      {new Date(course?.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 text-sm sm:text-base">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${course?.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {course?.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview Course */}
              <div className="bg-gradient-to-r-from-blue-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
                <h3 className="font-bold text-base sm:text-lg mb-2">
                  Preview Course
                </h3>
                <p className="mb-3 sm:mb-4 text-sm sm:text-base">See how students view your course</p>
                <button
                  onClick={() => setPreviewAsStudent(!previewAsStudent)}
                  className="w-full flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold py-2 sm:py-3 rounded-lg hover:bg-gray-100 text-sm sm:text-base"
                >
                  <FaEye /> Preview as Student
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default InstructorViewCourse;