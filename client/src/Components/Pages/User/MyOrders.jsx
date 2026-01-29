import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Contexts/userContext';
import { FaDownload, FaHistory, FaBookOpen, FaGraduationCap } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('/api/v1/stripe/get-my-orders');
                setOrders(res.data.orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6d28d2]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FaGraduationCap className="text-[#6d28d2]" /> My Learning
                        </h1>
                        <p className="text-gray-600 mt-1">Manage your enrolled courses and payment history</p>
                    </div>
                </div>

                {/* Purchase History */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-100 bg-[#fafafa]">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <FaHistory /> Recent Payments
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-sm font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                                    <th className="px-6 py-4">Course</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.length > 0 ? orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {order.courses?.[0]?.thumbnail && (
                                                    <img
                                                        src={order.courses[0].thumbnail}
                                                        alt=""
                                                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-900 truncate max-w-xs">
                                                        {order.courses?.[0]?.title || "Course Deleted"}
                                                    </p>
                                                    {order.courses?.length > 1 && (
                                                        <p className="text-xs text-gray-500">+{order.courses.length - 1} more items</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">${(order.amount / 100).toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.paymentStatus === 'succeeded'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.paymentStatus === 'succeeded' ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="text-[#6d28d2] hover:text-[#5022c3] text-sm font-semibold flex items-center gap-1"
                                                onClick={() => alert('Invoice receipt feature coming soon!')}
                                            >
                                                <FaDownload size={12} /> Receipt
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No payment history found. <Link to="/" className="text-[#6d28d2] underline">Explore courses</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* My Enrolled Courses */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaBookOpen /> Enrolled Courses
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.flatMap(o => o.courses || []).map((enrolledCourse, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <img
                                    src={enrolledCourse.thumbnail}
                                    alt={enrolledCourse.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 mb-2 truncate">{enrolledCourse.title}</h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-tighter">Active Enrollment</span>
                                    </div>
                                    <Link
                                        to={`/course/${enrolledCourse._id}`}
                                        className="block w-full text-center bg-[#6d28d2] text-white py-2 rounded-lg font-bold hover:bg-[#5022c3] transition-colors"
                                    >
                                        Continue Learning
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
