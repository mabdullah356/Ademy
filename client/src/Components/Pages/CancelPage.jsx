import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const CancelPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 p-4">
      <FaTimesCircle className="text-red-600 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-red-800 mb-2">Payment Cancelled</h1>
      <p className="text-red-700 mb-6 text-center">
        Your payment was not completed. You can try again or return to your cart.
      </p>
      <div className="flex gap-4">
        <Link
          to="/cart"
          className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Back to Cart
        </Link>
        <Link
          to="/courses"
          className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Browse Courses
        </Link>
      </div>
    </div>
  );
};

export default CancelPage;
