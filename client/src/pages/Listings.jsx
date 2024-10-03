import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaDollarSign } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchListings = async () => {
      try {
        const apiUrl = priceFilter
          ? `http://localhost:3000/api/listing?price=${priceFilter}`
          : `http://localhost:3000/api/listing`;

        const response = await axios.get(apiUrl);
        setListings(response.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("Failed to load listings.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchListings();
  }, [priceFilter]);

  const handleFilterClick = (filter) => {
    setPriceFilter(filter);
  };

  const handleShowAll = () => {
    setPriceFilter("");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-58px)] bg-white px-4">
        <div className="p-6 bg-red-100 text-red-700 shadow-lg rounded-lg border border-red-300">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-58px)] bg-white px-4">
        <div className="flex items-center justify-center">
          <div
            className="w-24 h-24 border-4 border-t-4 border-green-600 border-solid rounded-full animate-spin"
            style={{ borderTopColor: "transparent" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-6 lg:p-12 bg-gray-100 flex flex-col min-h-[calc(100vh-58px)]">
      <div className="flex justify-center items-center mb-8">
        <div className="bg-gray-200 rounded-3xl p-3 border border-black flex space-x-4">
          <button
            onClick={handleShowAll}
            className={`px-4 py-2 rounded-lg text-white ${
              priceFilter === "" ? "bg-green-500" : "bg-gray-300"
            } flex items-center`}
          >
            <IoMdClose className="mr-2" /> All
          </button>
          <button
            onClick={() => handleFilterClick("300")}
            className={`px-4 py-2 rounded-lg text-white ${
              priceFilter === "300" ? "bg-green-500" : "bg-gray-300"
            } flex items-center`}
          >
            <FaDollarSign />
          </button>
          <button
            onClick={() => handleFilterClick("600")}
            className={`px-4 py-2 rounded-lg text-white ${
              priceFilter === "600" ? "bg-green-500" : "bg-gray-300"
            } flex items-center`}
          >
            <FaDollarSign /> <FaDollarSign />
          </button>
          <button
            onClick={() => handleFilterClick("1000")}
            className={`px-4 py-2 rounded-lg text-white ${
              priceFilter === "1000" ? "bg-green-500" : "bg-gray-300"
            } flex items-center`}
          >
            <FaDollarSign /> <FaDollarSign /> <FaDollarSign />
          </button>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="flex items-center justify-center  bg-white px-4">
          <div className="p-6 bg-gray-200 text-gray-700 shadow-lg rounded-lg border border-black">
            <p className="text-lg font-semibold">
              No listings found for the selected filter.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-8 lg:gap-10 bg-gray-200 rounded-3xl p-6 border border-gray-400">
          {listings.map((listing) => (
            <Link
              key={listing._id}
              to={`/property/${listing._id}`}
              className="bg-white shadow-lg border border-gray-500 rounded-3xl overflow-hidden transform transition-transform hover:scale-105"
            >
              <img
                src={listing.imageUrl}
                alt={listing.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 flex flex-col items-center">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 uppercase mb-1 text-center">
                  {listing.name}
                </h2>
                <p className="text-gray-600 text-center">
                  Rooms: {listing.rooms} | Price: £{listing.price}
                  <span className="text-xs text-gray-600">/m</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        to="/profile"
        className="mt-12 mx-auto w-full sm:w-auto sm:max-w-xs text-center py-3 px-6 bg-green-600 text-white font-semibold rounded-3xl shadow-md hover:bg-green-700 transition-colors duration-200"
      >
        Go to Profile
      </Link>
    </div>
  );
}
