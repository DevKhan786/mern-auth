import React from "react";
import { Link } from "react-router-dom";
import "animate.css";

export default function Home() {
  return (
    <div className="flex flex-col h-[calc(100vh-58px)] max-h-screen bg-white text-gray-800">
      {/* Main Content Section */}
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-12 md:px-6 lg:px-12">
        <div className="border-2 border-black p-8 rounded-3xl flex flex-col justify-center items-center bg-gray-100 shadow-lg">
          <h1 className="text-3xl underline md:text-5xl lg:text-6xl font-extrabold mb-10 text-gray-800 animate__animated animate__fadeIn animate__delay-0.5s">
            Hamza<span className="text-orange-500">Rental</span>
          </h1>
          <p className="text-sm md:text-lg lg:text-xl mb-6 font-normal text-black animate__animated animate__fadeIn animate__delay-1s">
            Discover beautiful properties and make them your own. <br />
            <br />
            Explore our listings to find your dream home.
          </p>
          <Link
            to="/listings"
            className="px-6 py-3 mt-4 bg-red-600 text-white font-semibold rounded-full shadow-md transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out animate__animated animate__fadeIn animate__delay-1.5s"
          >
            Browse Listings
          </Link>
        </div>
      </div>

      {/* Footer Section */}
      <div className=" py-4 text-center">
        <Link
          to="/contact"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out animate__animated animate__fadeIn animate__delay-2s text-sm"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
