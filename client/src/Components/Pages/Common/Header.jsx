import React, { useState, useContext } from 'react'
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/images/logo.jpg"
import { AuthContext } from "../../Contexts/userContext";
import { FaUser } from 'react-icons/fa';
import { IoCartOutline } from "react-icons/io5";
import axios from 'axios';

function Header() {

  const { user } = useContext(AuthContext);
  const [popUp, setPopUP] = useState(true);
  const navigate = useNavigate();
  const AdemyCarts = JSON.parse(localStorage.getItem("ademyCart"));

  return (
    <header className="w-full">

      {popUp && (
        <div className='bg-[#c2e9eb] hidden md:flex  items-start sm:items-center justify-between gap-3 px-4 sm:px-10 py-4'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
            <h4 className='font-bold'>New to Ademy?</h4>
            <p className='text-sm'>
              Shop now for a limited-time offer: courses from $10.99.
            </p>
          </div>
          <span
            className="cursor-pointer text-xl"
            onClick={() => setPopUP(false)}
          >
            <RxCross2 />
          </span>
        </div>
      )}

      <nav className='px-4 sm:px-8 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between shadow-2xl gap-4'>

        <div className='flex items-center gap-3'>
          <img src={logo} alt="logo" className='h-10 sm:h-12' />
          <button className='hidden md:block font-medium'>Explore</button>
        </div>

        <div className='hidden sm:flex flex-1 justify-center'>
          <input
            type="text"
            placeholder='Search for anything'
            className='border-2 border-gray-200 outline-none py-2 rounded-xl w-full md:w-[70%] px-3'
          />
        </div>

        <div className='flex items-center gap-4'>
           <button
                onClick={() => navigate("/cart")}
                className='text-2xl relative'
              >
                <IoCartOutline />
                <span className='absolute -top-3 -right-3 text-xs font-bold w-5 h-5 flex items-center justify-center text-white bg-[#903fdc] rounded-full'>
                  {AdemyCarts?.length || 0}
                </span>
              </button>
          {user?.role === "user" && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/my-orders")}
                className="hidden md:block text-sm font-medium hover:text-[#6d28d2] transition-colors"
              >
                My Learning
              </button>
            </div>
          )}

          {!user ? (
            <div className='flex gap-2'>
              <button
                onClick={() => navigate("/login")}
                className='text-[#6d28d2] font-bold border-2 border-[#6d28d2] px-3 py-1 sm:py-2 rounded-lg text-sm'
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className='bg-[#6d28d2] font-bold text-white px-3 py-1 sm:py-2 rounded-lg text-sm'
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <h3 className="hidden sm:block font-bold text-gray-900 text-sm leading-tight">
                  {user?.name}
                </h3>
                <p className="hidden sm:block text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  {user?.role}
                </p>
              </div>

              <div className="relative group cursor-pointer">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#6d28d2] p-0.5"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#6d28d2] text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-100">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-xs text-gray-400">Account</p>
                    <p className="font-bold text-sm truncate">{user?.email}</p>
                  </div>

                  {user?.role === 'instructor' ? (
                    <button
                      onClick={() => navigate('/instructor-home')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Instructor Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/my-orders')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Learning
                    </button>
                  )}

                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        if (token) {
                          await axios.post("/api/v1/users/logout", null, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                        }
                      } catch (e) {
                        // Ignore errors - clear locally regardless
                      }
                      localStorage.removeItem("token");
                      window.location.href = "/";
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
