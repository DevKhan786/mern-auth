import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rooms: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0, // Ensures the number of bathrooms can't be negative
  },
  parking: {
    type: Boolean,
    default: false,
  },
  washingMachine: {
    type: Boolean,
    default: false,
  },
  kitchen: {
    type: Boolean,
    default: false,
  },
  wifi: {
    type: Boolean,
    default: false,
  },
  skylineView: {
    type: Boolean,
    default: false,
  },
  tv: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Listing = mongoose.model("Listing", ListingSchema);
export default Listing;
