import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaSpinner, FaGraduationCap } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(!!sessionId);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) return;

      try {
        await axios.post(`/api/v1/orders/verify-session?sessionId=${sessionId}`);
        setVerifying(false);
      } catch (err) {
        console.error("Payment verification failed:", err);
        setError("We couldn't verify your payment instantly, but don't worry! Our systems are processing it. Check 'My Learning' in a few minutes.");
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <FaSpinner className="text-[#6d28d2] text-6xl mb-4 animate-spin" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifying your payment...</h1>
        <p className="text-gray-600">Please wait while we set up your courses.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 p-4 text-center">
      <FaCheckCircle className="text-green-600 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-green-800 mb-2">
        {error ? "Payment Received!" : "Payment Successful!"}
      </h1>

      <div className="max-w-md">
        <p className="text-green-700 mb-6 font-medium">
          {error || "Thank you for your purchase. Your courses have been added to your dashboard and you can start learning immediately."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/my-orders"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-[#6d28d2] text-white rounded-xl font-bold hover:bg-[#5022c3] transition-all shadow-lg"
        >
          <FaGraduationCap /> Go to My Learning
        </Link>
        <Link
          to="/"
          className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
