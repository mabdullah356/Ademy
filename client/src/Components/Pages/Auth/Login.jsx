import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/userContext';

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = { email, password };
    try {
      const res = await axios.post("/api/v1/users/login", data);
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

  return (
    <section className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-8">
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
        <img
          src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-2-x2.webp"
          alt="login"
          className="w-full max-w-md lg:max-w-full"
        />
      </div>

      <div className="w-full lg:w-1/2 flex justify-center">
        <form onSubmit={submitHandler} className="w-full max-w-md flex flex-col space-y-4">
          <h2 className="font-bold text-2xl font-mono text-center lg:text-left">
            Log in to continue your learning journey
          </h2>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="w-full px-3 py-3 border rounded-sm"
            placeholder="email?"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            minLength={8}
            className="w-full px-3 py-3 border rounded-sm"
            placeholder="password"
          />

          <button
            type="submit"
            className="w-full rounded-sm p-3 bg-[#6d28d2] text-white font-semibold"
          >
            Continue
          </button>

          <div className="flex items-center gap-2 mt-4">
            <hr className="flex-1" />
            <p className="text-sm text-gray-500 text-center">Other log in options</p>
            <hr className="flex-1" />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
