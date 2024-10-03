import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCar, FaWifi, FaTv, FaCity } from "react-icons/fa";
import { MdKitchen, MdLocalLaundryService } from "react-icons/md";

export default function CreateListing() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rooms, setRooms] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parking, setParking] = useState(false);
  const [washingMachine, setWashingMachine] = useState(false);
  const [kitchen, setKitchen] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [skylineView, setSkylineView] = useState(false);
  const [tv, setTv] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, []);

  const navProfile = () => {
    navigate("/profile");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !rooms || !price || !imageUrl) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(price) || Number(price) < 0) {
      setError("Price must be a valid positive number.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/listing/create", {
        name,
        description,
        rooms,
        price: Number(price),
        imageUrl,
        bathrooms: Number(bathrooms),
        parking,
        washingMachine,
        kitchen,
        wifi,
        skylineView,
        tv,
      });
      navigate("/listings");
    } catch (error) {
      console.error(
        "Error creating listing: ",
        error.response ? error.response.data : error.message
      );
      setError(error.response?.data?.message || "Failed to create listing.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-55px)] bg-gray-100 p-2">
      <div className="w-full max-w-md p-6 shadow-lg rounded-3xl border-2 border-dashed border-gray-300 bg-white">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Create Listing
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter property name"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter property description"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="rooms"
              className="block text-gray-700 font-semibold mb-2"
            >
              Rooms
            </label>
            <input
              type="number"
              id="rooms"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter number of rooms"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 font-semibold mb-2"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter price"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="imageUrl"
              className="block text-gray-700 font-semibold mb-2"
            >
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter image URL"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="bathrooms"
              className="block text-gray-700 font-semibold mb-2"
            >
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter number of bathrooms"
            />
          </div>
          <div className=" grid grid-cols-2 mb-2">
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="parking"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="parking" className="text-gray-700 font-semibold">
                Parking
                <FaCar className="inline-block ml-2" />
              </label>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="washingMachine"
                checked={washingMachine}
                onChange={(e) => setWashingMachine(e.target.checked)}
                className="mr-2"
              />
              <label
                htmlFor="washingMachine"
                className="text-gray-700 font-semibold"
              >
                Washing Machine
                <MdLocalLaundryService className="inline-block ml-2" />
              </label>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="kitchen"
                checked={kitchen}
                onChange={(e) => setKitchen(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="kitchen" className="text-gray-700 font-semibold">
                Kitchen
                <MdKitchen className="inline-block ml-2" />
              </label>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="wifi"
                checked={wifi}
                onChange={(e) => setWifi(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="wifi" className="text-gray-700 font-semibold">
                Wi-Fi
                <FaWifi className="inline-block ml-2" />
              </label>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="skylineView"
                checked={skylineView}
                onChange={(e) => setSkylineView(e.target.checked)}
                className="mr-2"
              />
              <label
                htmlFor="skylineView"
                className="text-gray-700 font-semibold"
              >
                Skyline View
                <FaCity className="inline-block ml-2" />
              </label>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="tv"
                checked={tv}
                onChange={(e) => setTv(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="tv" className="text-gray-700 font-semibold">
                TV
                <FaTv className="inline-block ml-2" />
              </label>
            </div>
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full mb-3 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Create Listing
          </button>
          <button
            type="button"
            onClick={navProfile}
            className="w-full  py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Back to Profile
          </button>
        </form>
      </div>
    </div>
  );
}
