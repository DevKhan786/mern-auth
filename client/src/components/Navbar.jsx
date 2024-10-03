import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    console.log("Navbar user state:", user); // Ensure user state is logged
    if (!location.pathname.startsWith("/search")) {
      setSearchQuery("");
    }
  }, [location.pathname, user]);

  return (
    <div className="p-2 bg-gray-200 flex items-center justify-between shadow-md">
      <div className="flex-shrink-0">
        <Link
          to="/"
          className="text-sm hover:opacity-55 font-semibold flex items-center space-x-1 ease-in-out"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Hamza<span className="text-orange-500">Rental</span>
          </h1>
        </Link>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 mx-4 flex items-center border border-slate-300 rounded-full bg-white"
      >
        <input
          type="text"
          placeholder="Search..."
          className="p-2 w-full rounded-full border-none focus:outline-none focus:ring-0 bg-white text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="mr-2">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-500" />
        </button>
      </form>

      <div className="flex items-center space-x-4 text-slate-700">
        <Link to="/listings" className="text-sm hover:text-blue-600">
          Listings
        </Link>
        {!user ? (
          <Link to="/signin" className="text-sm hover:text-blue-600">
            Login
          </Link>
        ) : (
          <Link to="/profile" className="text-sm hover:text-blue-600">
            Profile
          </Link>
        )}
      </div>
    </div>
  );
}
