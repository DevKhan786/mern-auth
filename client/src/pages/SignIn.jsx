import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  clearError,
} from "../../redux/user/userSlice";
import OAuth from "../components/OAuth";

axios.defaults.withCredentials = true;

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(clearError());
    if (user) {
      navigate("/profile");
    }
  }, [dispatch, navigate, user]);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      return dispatch(signInFailure("Please enter your email and password."));
    }

    dispatch(signInStart());

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        { email, password }
      );

      if (response.data && response.data.token) {
        dispatch(
          signInSuccess({
            user: response.data.user,
            token: response.data.token,
          })
        );
        navigate("/profile");
      } else {
        throw new Error("Sign-in response did not contain token.");
      }
    } catch (error) {
      dispatch(
        signInFailure(
          error.response?.data?.message || "An unexpected error occurred"
        )
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-58px)] bg-gray-100 px-12">
      <div className="w-full max-w-md p-6 bg-gray-200 shadow-lg rounded-3xl border-2 border-dashed border-black">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Sign In
        </h2>
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
          onClick={handleSignIn}
          className={`w-full py-1 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <OAuth />
        {error && (
          <p className="mt-1 text-center font-bold text-red-500">{error}</p>
        )}
        <p className="text-xs text-center text-gray-800 mt-2">
          Don't have an account?
          <Link to="/signup" className="text-green-600 font-bold">
            {" "}
            Sign up...
          </Link>
        </p>
      </div>
    </div>
  );
}
