import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../redux/user/userSlice";
import { Link } from "react-router-dom";
import {
  FaBath,
  FaCar,
  FaWifi,
  FaTv,
  FaCity,
  FaCouch,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { MdKitchen, MdLocalLaundryService } from "react-icons/md";

axios.defaults.withCredentials = true;

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [fetchingListings, setFetchingListings] = useState(false);
  const [showListings, setShowListings] = useState(false);

  const [editingListingId, setEditingListingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    rooms: "",
    bathrooms: "",
    price: "",
    imageUrl: "",
    parking: false,
    washingMachine: false,
    kitchen: false,
    wifi: false,
    skylineView: false,
    tv: false,
  });

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/signout",
        {},
        { withCredentials: true }
      );
      dispatch(signOut());
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchUserListings = async () => {
    setFetchingListings(true);
    try {
      if (!user || !user._id) {
        console.error("User not logged in");
        return;
      }
      const response = await axios.get(
        `http://localhost:3000/api/listing/user/${user._id}`,
        {
          withCredentials: true,
        }
      );
      setListings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setFetchingListings(false);
    }
  };

  const deleteListing = async (listingId) => {
    try {
      await axios.delete(`http://localhost:3000/api/listing/${listingId}`, {
        withCredentials: true,
      });
      setListings(listings.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.error("Failed to delete listing:", error);
    }
  };

  const toggleListings = async () => {
    if (!showListings) {
      await fetchUserListings();
    }
    setShowListings(!showListings);
  };

  const handleEditClick = (listing) => {
    setEditingListingId(listing._id);
    setEditFormData({
      name: listing.name,
      description: listing.description,
      rooms: listing.rooms,
      bathrooms: listing.bathrooms || "",
      price: listing.price,
      imageUrl: listing.imageUrl,
      parking: listing.parking || false,
      washingMachine: listing.washingMachine || false,
      kitchen: listing.kitchen || false,
      wifi: listing.wifi || false,
      skylineView: listing.skylineView || false,
      tv: listing.tv || false,
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submitEdit = async (listingId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/listing/${listingId}`,
        editFormData,
        {
          withCredentials: true,
        }
      );
      setListings(
        listings.map((listing) =>
          listing._id === listingId ? { ...listing, ...editFormData } : listing
        )
      );
      setEditingListingId(null);
    } catch (error) {
      console.error("Failed to edit listing:", error);
    }
  };

  const cancelEdit = () => {
    setEditingListingId(null);
    setEditFormData({
      name: "",
      description: "",
      rooms: "",
      bathrooms: "",
      price: "",
      imageUrl: "",
      parking: false,
      washingMachine: false,
      kitchen: false,
      wifi: false,
      skylineView: false,
      tv: false,
    });
  };

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-58px)] bg-gray-100 px-4">
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-55px)] bg-gray-100 px-4">
      <div className="w-full mt-10 max-w-3xl p-6 shadow-lg rounded-3xl border-2 border-black  bg-white mb-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Profile
        </h1>
        <div className="bg-gray-50 p-6 rounded-md flex flex-col justify-center items-center shadow-md mb-6 border border-gray-200">
          <p className="text-lg font-semibold text-gray-700 mb-2">
            <strong>Username:</strong> {user.username}
          </p>
          <p className="text-lg font-semibold text-gray-700">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <div className="m-auto">
          <button
            onClick={() => navigate("/create-listing")}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200 mb-4"
          >
            Create Listing
          </button>

          <button
            onClick={toggleListings}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors mb-4 duration-200"
            disabled={fetchingListings}
          >
            {fetchingListings
              ? "Loading..."
              : showListings
              ? "Hide Listings"
              : "Show Your Listings"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors duration-200 "
          >
            Sign Out
          </button>
        </div>
        {showListings && (
          <div className="mt-10 w-full max-w-3xl">
            <div className="p-4 bg-gray-200 border border-gray-300 rounded-lg mb-6">
              <h1 className="text-2xl font-bold text-center text-gray-800">
                Listings:
              </h1>
            </div>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl underline font-bold mb-2 text-gray-800">
                        {listing.name}
                      </h3>
                      <p className="text-gray-700 mb-4 h-24 overflow-hidden text-ellipsis">
                        {listing.description}
                      </p>
                      <p className="text-gray-700 mb-2">
                        <FaCouch className="inline-block mr-2" />
                        Rooms: {listing.rooms}
                      </p>
                      <p className="text-gray-700 mb-2">
                        <FaBath className="inline-block mr-2" />
                        Bathrooms: {listing.bathrooms}
                      </p>
                      <p className="text-gray-700 mb-6">
                        <FaCity className="inline-block mr-2" />
                        Price: ${listing.price}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-4 ">
                        <p className="text-gray-700 mb-2">
                          <FaCar className="inline-block mr-2" />
                          {listing.parking ? (
                            <FaCheck className="inline-block ml-2 text-green-500" />
                          ) : (
                            <FaTimes className="inline-block ml-2 text-red-500" />
                          )}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <MdLocalLaundryService className="inline-block mr-2" />
                          {listing.washingMachine ? (
                            <FaCheck className="inline-block ml-2 text-green-500" />
                          ) : (
                            <FaTimes className="inline-block ml-2 text-red-500" />
                          )}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <MdKitchen className="inline-block mr-2" />
                          {listing.kitchen ? (
                            <FaCheck className="inline-block ml-2 text-green-500" />
                          ) : (
                            <FaTimes className="inline-block ml-2 text-red-500" />
                          )}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <FaWifi className="inline-block mr-2" />
                          {listing.wifi ? (
                            <FaCheck className="inline-block ml-2 text-green-500" />
                          ) : (
                            <FaTimes className="inline-block ml-2 text-red-500" />
                          )}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <FaTv className="inline-block mr-2" />
                          {listing.tv ? (
                            <FaCheck className="inline-block ml-2 text-green-500" />
                          ) : (
                            <FaTimes className="inline-block ml-2 text-red-500" />
                          )}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <FaCity className="inline-block mr-2" />
                          {listing.skylineView ? (
                            <FaCheck className="inline-block ml-2 text-green-500" />
                          ) : (
                            <FaTimes className="inline-block ml-2 text-red-500" />
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Link
                        to={`/property/${listing._id}`}
                        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 mb-4 block text-center"
                      >
                        View Listing
                      </Link>
                      <button
                        onClick={() => handleEditClick(listing)}
                        className="w-full py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition-colors duration-200 mb-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteListing(listing._id)}
                        className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>

                    {editingListingId === listing._id && (
                      <div className="mt-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            submitEdit(listing._id);
                          }}
                        >
                          <div className="grid grid-cols-1 gap-4">
                            <div className="mb-4">
                              <label className="block text-gray-700 mb-2 font-semibold">
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleFormChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 mb-2 font-semibold">
                                Description
                              </label>
                              <textarea
                                name="description"
                                value={editFormData.description}
                                onChange={handleFormChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="mb-4">
                                <label className="block text-gray-700 mb-2 font-semibold">
                                  Rooms
                                </label>
                                <input
                                  type="number"
                                  name="rooms"
                                  value={editFormData.rooms}
                                  onChange={handleFormChange}
                                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-gray-700 mb-2 font-semibold">
                                  Bathrooms
                                </label>
                                <input
                                  type="number"
                                  name="bathrooms"
                                  value={editFormData.bathrooms}
                                  onChange={handleFormChange}
                                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 mb-2 font-semibold">
                                Price
                              </label>
                              <input
                                type="number"
                                name="price"
                                value={editFormData.price}
                                onChange={handleFormChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 mb-2 font-semibold">
                                Image URL
                              </label>
                              <input
                                type="text"
                                name="imageUrl"
                                value={editFormData.imageUrl}
                                onChange={handleFormChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="mb-4 flex items-center">
                                <input
                                  type="checkbox"
                                  name="parking"
                                  checked={editFormData.parking}
                                  onChange={handleFormChange}
                                  className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <label className="ml-2 text-gray-700">
                                  Parking
                                </label>
                              </div>
                              <div className="mb-4 flex items-center">
                                <input
                                  type="checkbox"
                                  name="washingMachine"
                                  checked={editFormData.washingMachine}
                                  onChange={handleFormChange}
                                  className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <label className="ml-2 text-gray-700">
                                  Washing Machine
                                </label>
                              </div>
                              <div className="mb-4 flex items-center">
                                <input
                                  type="checkbox"
                                  name="kitchen"
                                  checked={editFormData.kitchen}
                                  onChange={handleFormChange}
                                  className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <label className="ml-2 text-gray-700">
                                  Kitchen
                                </label>
                              </div>
                              <div className="mb-4 flex items-center">
                                <input
                                  type="checkbox"
                                  name="wifi"
                                  checked={editFormData.wifi}
                                  onChange={handleFormChange}
                                  className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <label className="ml-2 text-gray-700">
                                  WiFi
                                </label>
                              </div>
                              <div className="mb-4 flex items-center">
                                <input
                                  type="checkbox"
                                  name="skylineView"
                                  checked={editFormData.skylineView}
                                  onChange={handleFormChange}
                                  className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <label className="ml-2 text-gray-700">
                                  Skyline View
                                </label>
                              </div>
                              <div className="mb-4 flex items-center">
                                <input
                                  type="checkbox"
                                  name="tv"
                                  checked={editFormData.tv}
                                  onChange={handleFormChange}
                                  className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <label className="ml-2 text-gray-700">TV</label>
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                type="submit"
                                className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="py-2 px-4 bg-gray-400 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors duration-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No listings available.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
