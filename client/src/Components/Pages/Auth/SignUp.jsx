import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/userContext';
import { GoogleLogin } from '@react-oauth/google';
import { FaFacebook, FaGithub } from 'react-icons/fa';

const SignUp = () => {
  const { setUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isInstructor, setIsInstructor] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = {
      name,
      email,
      password,
      role: isInstructor ? "instructor" : "user"
    };
    try {
      const res = await axios.post("/api/v1/users/register", data);
      alert(res.data.message);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      if (res.data.user?.role === "instructor") {
        navigate("/instructor-home");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("error");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("/api/v1/users/google-login", {
        credential: credentialResponse.credential,
        role: isInstructor ? "instructor" : "user"
      });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      if (res.data.user?.role === "instructor") {
        navigate("/instructor-home");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Google Login failed:", error);
      alert("Google login failed");
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-8">
      <div className="hidden lg:block w-1/2">
        <img
          src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-2-x2.webp"
          alt="signup"
          className="w-full"
        />
      </div>

      <div className="w-full lg:w-1/2 flex justify-center">
        <form onSubmit={submitHandler} className="w-full max-w-md flex flex-col space-y-4">
          <h2 className="font-bold text-2xl font-mono text-center lg:text-left">
            Sign up to start your learning journey
          </h2>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={3}
            type="text"
            className="w-full px-3 py-3 border rounded-sm"
            placeholder="Name"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="w-full px-3 py-3 border rounded-sm"
            placeholder="Email"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            minLength={8}
            className="w-full px-3 py-3 border rounded-sm"
            placeholder="Password"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isInstructor}
              onChange={() => setIsInstructor(!isInstructor)}
              className="w-4 h-4"
            />
            Sign up as an instructor
          </label>

          <button
            type="submit"
            className="w-full rounded-sm p-3 bg-[#6d28d2] text-white font-semibold"
          >
            Continue
          </button>

          <div className="flex items-center gap-2 mt-4">
            <hr className="flex-1" />
            <p className="text-sm text-gray-500 text-center">Other sign up options</p>
            <hr className="flex-1" />
          </div>

          <div className="flex flex-col space-y-3 pt-2">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert('Google Login Failed')}
                useOneTap
                theme="outline"
                shape="square"
                width="100%"
              />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 p-3 border rounded-sm hover:bg-gray-50 transition-colors font-semibold shadow-sm"
            >
              <FaFacebook className="text-blue-600" />
              Continue with Facebook
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 p-3 border rounded-sm hover:bg-gray-50 transition-colors font-semibold"
            >
              <FaGithub className="text-gray-900" />
              Continue with GitHub
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
