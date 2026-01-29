import React, { useState } from 'react';
import axios from 'axios';
import { FaLock, FaSpinner } from 'react-icons/fa';

/**
 * Shared Checkout Button Component
 * @param {Array} cartIds - Array of course IDs to purchase
 * @param {string} label - Button text
 * @param {string} className - Optional custom styles
 * @param {boolean} disabled - Optional disable state
 */
const CheckoutButton = ({ cartIds, label = "Checkout", className = "", disabled = false }) => {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!cartIds || cartIds.length === 0) {
            alert("No courses selected for purchase.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("/api/v1/stripe/checkout", {
                cartIds: cartIds,
            });

            // Clear local cart if checkout is successful
            // We only clear if they were checking out from the cart page
            // But clearing it anyway is safe as they are redirecting to Stripe
            localStorage.removeItem("ademyCart");

            // Redirect to Stripe checkout
            window.location.href = res.data.url;
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Checkout failed: " + (error.response?.data?.message || "Internal server error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading || disabled}
            className={`relative flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {loading ? (
                <FaSpinner className="animate-spin text-xl" />
            ) : (
                <>
                    <FaLock className="text-sm opacity-80" />
                    {label}
                </>
            )}
        </button>
    );
};

export default CheckoutButton;
