// src/components/PropertyDetails.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCar,
  FaWifi,
  FaTv,
  FaCity,
  FaCheck,
  FaTimes,
  FaBed,
  FaBath,
} from "react-icons/fa";
import { MdKitchen, MdLocalLaundryService } from "react-icons/md";
import { AiOutlineDollar } from "react-icons/ai";
import { Tooltip as ReactTooltip } from "react-tooltip";
import ChatComponent from "../components/ChatComponent";

export default function PropertyDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false); // New state for chat visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/listing/${id}`
        );
        setListing(response.data);
      } catch (error) {
        console.error("Error fetching listing details:", error);
        setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-58px)] bg-white px-4">
        <div className="p-6 bg-red-100 text-red-700 shadow-lg rounded-lg border border-red-300">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-58px)] bg-white px-4">
        <div className="p-6 bg-gray-200 text-gray-700 shadow-lg rounded-lg border border-gray-300">
          <p className="text-lg font-semibold">Property not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 lg:p-12 bg-gray-100 min-h-[calc(100vh-58px)] flex flex-col items-center">
      <button
        onClick={() => navigate("/listings")}
        className="mb-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
      >
        Back to Listings
      </button>

      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white shadow-lg border border-black rounded-3xl overflow-hidden p-4">
        <div className="w-full md:w-2/3 pr-4">
          <img
            src={listing.imageUrl}
            alt={listing.name}
            className="w-full h-64 md:h-auto object-cover"
          />
        </div>

        <div className="w-full md:w-1/3 bg-gray-100 p-4 flex flex-col justify-between border-t md:border-t-0 md:border-l rounded-b-3xl md:rounded-r-3xl rounded-3xl">
          <div className="flex-grow">
            <p className="text-gray-800 text-xs font-bold">
              Hosted by{" "}
              <span className="underline">{listing.userId.username}</span>
            </p>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {listing.name}
            </h2>
            <div className="bg-gray-200 p-3 rounded-3xl mb-6">
              <p className="text-gray-600 mb-4">{listing.description}</p>
              <p className="text-black mb-4">
                <FaBed className="inline mr-2" />
                Rooms: {listing.rooms}
              </p>
              <p className="text-black mb-4">
                <FaBath className="inline mr-2" />
                Bathrooms: {listing.bathrooms}
              </p>
              <p className="text-black mb-4">
                <AiOutlineDollar className="inline mr-2" />
                Price: £{listing.price}
                <span className="text-xs text-gray-600">/m</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-4 mt-6">
            <button
              onClick={() => setShowChat((prev) => !prev)} // Toggle chat visibility
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              {showChat ? "Hide Chat" : "Contact Host"}
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors">
              Reserve
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 w-full max-w-6xl bg-white shadow-lg border border-black rounded-3xl p-4 gap-2 mt-6">
        <div
          className="flex bg-gray-200 p-2 rounded-3xl items-center justify-center"
          data-tooltip-id="tooltip-parking"
        >
          <FaCar className="text-gray-700 text-xl mx-1" />
          {listing.parking ? (
            <FaCheck className="text-green-600 text-xl mx-1" />
          ) : (
            <FaTimes className="text-red-600 text-xl mx-1" />
          )}
        </div>
        <div
          className="flex bg-gray-200 p-2 rounded-3xl items-center justify-center"
          data-tooltip-id="tooltip-washing-machine"
        >
          <MdLocalLaundryService className="text-gray-700 text-xl mx-1" />
          {listing.washingMachine ? (
            <FaCheck className="text-green-600 text-xl mx-1" />
          ) : (
            <FaTimes className="text-red-600 text-xl mx-1" />
          )}
        </div>
        <div
          className="flex bg-gray-200 p-2 rounded-3xl items-center justify-center"
          data-tooltip-id="tooltip-kitchen"
        >
          <MdKitchen className="text-gray-700 text-xl mx-1" />
          {listing.kitchen ? (
            <FaCheck className="text-green-600 text-xl mx-1" />
          ) : (
            <FaTimes className="text-red-600 text-xl mx-1" />
          )}
        </div>
        <div
          className="flex bg-gray-200 p-2 rounded-3xl items-center justify-center"
          data-tooltip-id="tooltip-wifi"
        >
          <FaWifi className="text-gray-700 text-xl mx-1" />
          {listing.wifi ? (
            <FaCheck className="text-green-600 text-xl mx-1" />
          ) : (
            <FaTimes className="text-red-600 text-xl mx-1" />
          )}
        </div>
        <div
          className="flex bg-gray-200 p-2 rounded-3xl items-center justify-center"
          data-tooltip-id="tooltip-skyline-view"
        >
          <FaCity className="text-gray-700 text-xl mx-1" />
          {listing.skylineView ? (
            <FaCheck className="text-green-600 text-xl mx-1" />
          ) : (
            <FaTimes className="text-red-600 text-xl mx-1" />
          )}
        </div>
        <div
          className="flex bg-gray-200 p-2 rounded-3xl items-center justify-center"
          data-tooltip-id="tooltip-tv"
        >
          <FaTv className="text-gray-700 text-xl mx-1" />
          {listing.tv ? (
            <FaCheck className="text-green-600 text-xl mx-1" />
          ) : (
            <FaTimes className="text-red-600 text-xl mx-1" />
          )}
        </div>
      </div>

      {showChat && (
        <div className="fixed bottom-4 right-4 z-50">
          <ChatComponent />
        </div>
      )}

      <ReactTooltip id="tooltip-parking" place="top" effect="solid">
        Parking
      </ReactTooltip>
      <ReactTooltip id="tooltip-washing-machine" place="top" effect="solid">
        Washing Machine
      </ReactTooltip>
      <ReactTooltip id="tooltip-kitchen" place="top" effect="solid">
        Kitchen
      </ReactTooltip>
      <ReactTooltip id="tooltip-wifi" place="top" effect="solid">
        Wifi
      </ReactTooltip>
      <ReactTooltip id="tooltip-skyline-view" place="top" effect="solid">
        Skyline View
      </ReactTooltip>
      <ReactTooltip id="tooltip-tv" place="top" effect="solid">
        TV
      </ReactTooltip>
    </div>
  );
}
