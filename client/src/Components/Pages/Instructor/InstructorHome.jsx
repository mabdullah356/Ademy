import React, { useState, useEffect } from 'react';
import {
  FaUsers, FaDollarSign, FaBookOpen, FaStar, FaChartBar, FaClock,
  FaChevronRight, FaUserCheck, FaCommentDollar, FaBook, FaStarHalfAlt
} from 'react-icons/fa';
import { BsGraphUp, BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InstructorHome = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();



  const [loading, setLoading] = useState(true);

  const totalStudents = courses.reduce((sum, course) => sum + (course.studentsEnrolled || 0), 0);
  const totalRatingCount = courses.reduce((sum, course) => sum + (course.ratingCount || 0), 0);
  const totalRating = courses.length > 0
    ? (courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length).toFixed(1)
    : 0;

  // Flatten all orders from all courses for the "Recent Enrollments" list
  const allOrders = courses.flatMap(course =>
    (course.orders || []).map(order => ({
      ...order,
      courseTitle: course.title
    }))
  ).sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));

  const totalRevenue = allOrders.reduce((sum, order) => sum + (order.amount / 100), 0);

  // Stats data
  const stats = [
    { title: "Total Students", value: totalStudents, icon: <FaUsers className="text-xl" />, change: "+12%", color: "bg-blue-500" },
    { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: <FaDollarSign className="text-xl" />, change: "+18%", color: "bg-green-500" },
    { title: "Total Courses", value: courses.length, icon: <FaBookOpen className="text-xl" />, change: "+2", color: "bg-purple-500" },
    { title: "Avg. Rating", value: `${totalRating}/5`, icon: <FaStar className="text-xl" />, change: `(${totalRatingCount} ratings)`, color: "bg-amber-500" },
  ];

  // Quick actions
  const quickActions = [
    { title: "Create New Course", icon: <FaBook />, color: "bg-blue-100 text-blue-600", navigate: "/create-course" },
    { title: "View Analytics", icon: <BsGraphUp />, color: "bg-green-100 text-green-600" },
    { title: "Manage Students", icon: <FaUsers />, color: "bg-purple-100 text-purple-600" },
    { title: "Check Reviews", icon: <FaStarHalfAlt />, color: "bg-amber-100 text-amber-600" },
  ];




  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/api/v1/courses/me");
        if (res.status === 200) setCourses(res.data.courses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="px-4 md:px-7 py-5 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 flex-wrap">
        <div>
          <h2 className="font-bold text-2xl md:text-3xl font-sans text-gray-900">Instructor Dashboard</h2>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Welcome back! Here's what's happening with your courses.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="font-mono text-red-500 bg-red-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-red-100 text-sm md:text-base">
            Logged in as Instructor
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>{stat.icon}</div>
              <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded">{stat.change}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm md:text-base">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <button key={idx} onClick={() => navigate(action?.navigate)}
              className="flex flex-col items-center justify-center p-4 md:p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className={`p-3 rounded-full mb-3 ${action.color}`}>{action.icon}</div>
              <span className="font-medium text-gray-900 text-sm md:text-base">{action.title}</span>
            </button>
          ))}
        </div>
      </div>


      {/* Recent Courses & Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Recent Courses</h3>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700">
              View all <FaChevronRight className="text-xs" />
            </button>
          </div>
          <div className="space-y-3">
            {courses?.map((course, idx) => (
              <div key={idx} onClick={() => navigate(`/course-/${course?._id}`)} className="flex items-center justify-between p-3 md:p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors flex-wrap">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm md:text-base">{course?.title}</h4>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs md:text-sm">
                    <span className="text-gray-600 flex items-center gap-1"><FaUsers className="text-xs" /> {course?.studentsEnrolled} students</span>
                    <span className="text-gray-600 flex items-center gap-1"><FaDollarSign className="text-xs" /> {course?.price}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {course.isPublished ? "Live" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Recent Enrollments</h3>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700">
              View all <FaChevronRight className="text-xs" />
            </button>
          </div>
          <div className="space-y-3">
            {allOrders.slice(0, 5).map((enroll, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 md:p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors flex-wrap">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm md:text-base capitalize">{enroll.studentName}</h4>
                  <p className="text-xs md:text-sm text-gray-600">{enroll.courseTitle}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <FaClock className="text-xs" /> {new Date(enroll.orderedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-gray-900 text-sm md:text-base">${enroll.amount}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${enroll.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {enroll.status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
            {allOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No recent enrollments found.
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}

export default InstructorHome;
