import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// GET ALL MESSAGES FOR A ROOM
router.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.status(200).json({ message: "Messages fetched", messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// SAVE A NEW MESSAGE
router.post("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { sender, text } = req.body;
    const newMessage = await Message.create({ roomId, sender, text });
    res.status(201).json({ message: "Message saved", newMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;