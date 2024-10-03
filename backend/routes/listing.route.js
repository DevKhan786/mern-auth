import express from "express";
import Listing from "../models/ListingModel.js";
import { verifyToken } from "../utils/verifyUser.js";
import mongoose from "mongoose";

const router = express.Router();

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.user.id;

    const {
      name,
      description,
      rooms,
      price,
      imageUrl,
      bathrooms,
      parking,
      washingMachine,
      kitchen,
      wifi,
      skylineView,
      tv,
    } = req.body;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (listing.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this listing." });
    }

    if (!name || !description || !rooms || !price || !imageUrl) {
      return res.status(400).json({ message: "All fields are required." });
    }

    listing.name = name;
    listing.description = description;
    listing.rooms = rooms;
    listing.price = price;
    listing.imageUrl = imageUrl;
    listing.bathrooms = bathrooms;
    listing.parking = parking;
    listing.washingMachine = washingMachine;
    listing.kitchen = kitchen;
    listing.wifi = wifi;
    listing.skylineView = skylineView;
    listing.tv = tv;

    await listing.save();

    res.status(200).json({ message: "Listing updated successfully.", listing });
  } catch (err) {
    console.error("Error updating listing:", err);
    res
      .status(500)
      .json({ message: "Error updating listing", error: err.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.user.id;
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (listing.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this listing." });
    }

    await Listing.findByIdAndDelete(listingId);
    res.status(200).json({ message: "Listing deleted successfully." });
  } catch (err) {
    console.error("Error deleting listing:", err);
    res
      .status(500)
      .json({ message: "Error deleting listing", error: err.message });
  }
});

router.post("/create", verifyToken, async (req, res) => {
  try {
    const {
      name,
      description,
      rooms,
      price,
      imageUrl,
      bathrooms,
      parking,
      washingMachine,
      kitchen,
      wifi,
      skylineView,
      tv,
    } = req.body;
    const userId = req.user.id;

    if (!name || !description || !rooms || !price || !imageUrl) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res
        .status(400)
        .json({ message: "Price must be a valid positive number." });
    }

    const newListing = new Listing({
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
      userId,
    });

    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    console.error("Error creating listing:", err);
    res
      .status(500)
      .json({ message: "Error creating listing", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { search, price } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (price === "300") {
      query.price = { $lte: 300 };
    } else if (price === "600") {
      query.price = { $gt: 300, $lte: 600 };
    } else if (price === "1000") {
      query.price = { $gt: 600 };
    }

    const listings = await Listing.find(query).populate("userId", "username");
    res.status(200).json(listings);
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({ message: "Error fetching listings" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "userId",
      "username"
    );
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }
    res.status(200).json(listing);
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({ message: "Error fetching listing" });
  }
});

router.get("/user/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }
  try {
    const listings = await Listing.find({ userId });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching listings." });
  }
});

export default router;
