import express from "express";
import Chat from "../models/Chat.js";
import mongoose from "mongoose";

const router = express.Router();

// Create a new chat
router.post("/", async (req, res) => {
  try {
    const { listingId, participants } = req.body;

    // Log inputs for debug
    console.log("Creating new chat with:", { listingId, participants });

    const chat = new Chat({ listingId, participants });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get a chat by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Log chat ID being retrieved
    console.log("Retrieving chat with ID:", id);

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid chat ID format" });
    }

    const chat = await Chat.findById(id).populate(
      "messages.sender",
      "username"
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error retrieving chat:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
