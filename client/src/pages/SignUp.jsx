import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { useSelector } from "react-redux";

axios.defaults.withCredentials = true;

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [navigate, user]);

  const handleSignUp = async () => {
    setMessage("");

    if (!username || !email || !password) {
      return setMessage("Please enter a username, email, and password.");
    }

    if (password.length < 6) {
      return setMessage("Password must be at least 6 characters long.");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        { username, email, password }
      );
      setMessage(response.data.message);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-58px)] bg-gray-100 px-12">
      <div className="w-full max-w-md p-6 bg-gray-200 shadow-lg rounded-3xl border-2 border-dashed border-black">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Sign Up
        </h2>
        <div className="mb-4">
          <label
            className="block text-gray-600 text-sm font-semibold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded-md"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-600 text-sm font-semibold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded-md"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-600 text-sm font-semibold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded-md"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          onClick={handleSignUp}
          className={`w-full py-1 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <OAuth />
        {message && (
          <p className="mt-1 text-center font-bold text-red-500">{message}</p>
        )}
        <p className="text-xs text-center text-gray-800 mt-2">
          Already have an account?
          <Link to="/signin" className="text-green-600 font-bold">
            {" "}
            Sign in...
          </Link>
        </p>
      </div>
    </div>
  );
}
