import express from "express";
import { v4 as uuidv4 } from "uuid";
import Room from "../models/Room.js";

const router = express.Router();

// get all rooms
router.get("/", async (req, res) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Rooms fetched", rooms });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// create a new room
router.post("/create", async (req, res) => {
    try {
        const { username, name, language, roomPassword } = req.body;
        const roomId = uuidv4().slice(0, 6).toUpperCase();

        const newRoom = await Room.create({
            roomId,
            name: name || "Unnamed Room",
            roomPassword: roomPassword || "",
            language: language || "javascript",
            code: "",
            users: []
        });

        res.status(201).json({ message: "Room created", room: newRoom });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// get a single room by roomId
router.get("/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findOne({ roomId });
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({ message: "Room found", room });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// delete a room
router.delete("/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findOneAndDelete({ roomId });
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({ message: "Room deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;