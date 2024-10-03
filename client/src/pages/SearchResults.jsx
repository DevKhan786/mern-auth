import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const SearchResults = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    setLoading(true);
    if (query) {
      axios
        .get(`http://localhost:3000/api/listing?search=${encodeURIComponent(query)}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setListings(response.data);
          } else {
            console.error("Unexpected response format:", response.data);
            setListings([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setError("Failed to load search results.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setListings([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-55px)] bg-gray-100 px-4 py-12">
        <div
          className="w-24 h-24 border-4 border-t-4 border-green-600 border-solid rounded-full animate-spin"
          style={{ borderTopColor: "transparent" }}
        ></div>
        <p className="mt-4 text-lg font-semibold text-gray-600">
          Searching for "{query}"...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-55px)] bg-gray-100 px-4 py-12">
        <div className="p-6 bg-red-100 text-red-700 shadow-lg rounded-lg border border-red-300">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-6 lg:p-12 bg-white flex flex-col min-h-[calc(100vh-55px)]">
      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] ">
          <FaSearch className="text-gray-400 text-6xl mb-4" />
          <p className="text-lg font-semibold text-gray-600">
            No results found for "{query}".
          </p>
          <p className="mt-2 text-gray-500">
            Try a different search term or adjust your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 bg-gray-200 rounded-3xl">
          {listings.map((listing) => (
            <Link
              key={listing._id}
              to={`/property/${listing._id}`}
              className="bg-white shadow-lg border border-gray-300 rounded-3xl overflow-hidden transform transition-transform hover:scale-105"
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
    </div>
  );
};

export default SearchResults;
