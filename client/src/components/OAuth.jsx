import React, { useEffect } from "react";
import { auth, provider } from "../firebase-cfg";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  clearError,
} from "../../redux/user/userSlice.js";

axios.defaults.withCredentials = true;

export default function OAuth({ onError }) {
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleGoogle = async () => {
    dispatch(signInStart());

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email || !user.displayName) {
        throw new Error("Email or Name is missing...");
      }

      const response = await axios.post(
        "http://localhost:3000/api/auth/google",
        {
          email: user.email,
          username: user.displayName,
        }
      );

      console.log("Received response data:", response.data);
      console.log("Received token:", response.data.token);

      if (response.data && response.data.token) {
        dispatch(
          signInSuccess({ user: response.data, token: response.data.token })
        );
        navigate("/profile");
      } else {
        throw new Error("Sign-in response did not contain token.");
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Google sign-in failed";
      dispatch(signInFailure(errorMessage));
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      dispatch(clearError());
    }
  };

  return (
    <button
      onClick={handleGoogle}
      className={`w-full mt-4 mb-2 py-1 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={loading}
    >
      {loading ? "Signing In..." : "Continue with Google"}
    </button>
  );
}
