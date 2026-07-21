import { useEffect, useState } from "react";
import { calculateDiscountedPrice, formatCurrency } from "../../Utils/pricing";
import CheckoutButton from "../Common/CheckoutButton";
import axios from "axios";

const Cart = () => {
  const AdemyCarts = JSON.parse(localStorage.getItem("ademyCart")) || [];
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      if (!AdemyCarts || AdemyCarts.length === 0) return;

      const res = await axios.post("/api/v1/courses/batch", { ids: AdemyCarts });

      setCourses(res.data.courses || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleRemove = (id) => {
    const newCarts = AdemyCarts.filter((p) => p !== id);
    localStorage.setItem("ademyCart", JSON.stringify(newCarts));
    setCourses(courses.filter((c) => c._id !== id));
  };

  // Checkout logic now handled by CheckoutButton component

  // CORRECTED PRICE CALCULATIONS
  const originalPrice = courses.reduce((sum, c) => sum + (Number(c.price) * 100 || 0), 0);
  const finalPrice = courses.reduce((sum, c) => {
    const discounted = calculateDiscountedPrice(c.price, c.discount);
    return sum + (discounted * 100);
  }, 0);
  const discountAmount = originalPrice - finalPrice;

  return (
    <section className="px-6 py-8 w-full max-w-7xl mx-auto">
      <h2 className="font-bold text-4xl text-gray-900 mb-2">Shopping Cart</h2>
      <h5 className="font-semibold text-lg text-gray-600 mb-8">
        {AdemyCarts.length} Courses in Cart
      </h5>

      <button
        onClick={() => (window.location.href = "/")}
        className="font-bold border px-2 py-3 rounded-lg mb-6"
      >
        Go To Home
      </button>

      <section className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {courses?.map((item, i) => {
            const itemPrice = Number(item.price) || 0;
            const itemDiscount = Number(item.discount) || 0;
            const hasDiscount = itemDiscount > 0 && itemDiscount < itemPrice;

            return (
              <div
                key={i}
                className="border border-gray-200 rounded-2xl shadow-sm p-6 mb-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img
                      src={item?.thumbnail}
                      alt={item?.title}
                      className="rounded-xl w-full h-auto object-cover"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="font-bold text-2xl text-gray-900 mb-2">
                      {item?.title}
                    </h2>
                    <p className="text-gray-600 mb-1">{item?.instructorId}</p>

                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center text-amber-600 font-semibold">
                        ⭐ {item.rating}/5 ({item?.ratingCount} ratings)
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                        Bestseller
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-semibold">
                          {item?.content?.totalDuration}m
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Lectures</p>
                        <p className="font-semibold">
                          {item?.content?.sections?.length || 0}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Level</p>
                        <p className="font-semibold">{item?.level}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      {hasDiscount ? (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 line-through">
                            ${itemPrice.toFixed(2)}
                          </span>
                          <span className="font-semibold text-gray-900">
                            ${calculateDiscountedPrice(itemPrice, itemDiscount).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-gray-900">
                          ${itemPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="px-5 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                      >
                        Remove
                      </button>
                      <button className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                        Save for Later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:w-1/3">
          {AdemyCarts.length > 0 && (
            <div className="border border-gray-200 rounded-2xl shadow-sm p-6 bg-gray-50 sticky top-6">
              <h3 className="font-bold text-2xl text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Price</span>
                  <span className="font-semibold">
                    {formatCurrency(originalPrice)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount Savings</span>
                    <span className="text-green-600 font-semibold">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-t pt-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(finalPrice)}
                  </span>
                </div>
              </div>

              <CheckoutButton
                cartIds={AdemyCarts}
                label="Proceed to Checkout"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mb-4 shadow-lg shadow-blue-100"
              />

              <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-lg transition">
                Apply Coupon
              </button>

              <p className="text-sm text-gray-500 text-center mt-6">
                30-Day Money-Back Guarantee
              </p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
};

export default Cart;