import React from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-58px)] bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-8 md:px-6 lg:px-12">
      <div className="bg-white shadow-lg rounded-3xl p-8 md:p-10 lg:p-12 max-w-lg w-full border border-gray-300">
        <div className="mb-6 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 text-teal-600 hover:text-teal-700 font-medium bg-white border border-teal-500 rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-teal-50 duration-300"
          >
            &larr; Back to Home
          </Link>
        </div>
        <div className="p-8 bg-gray-100 rounded-3xl border border-gray-300 shadow-md transition-shadow duration-300">
          <div className="text-center">
            <h2 className="text-lg font-extrabold tracking-widest underline text-black mb-2">
              Email:
            </h2>
            <p className="text-lg text-teal-600 hover:underline">
              <a href="mailto:HKVain786@gmail.com">HKVain786@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
