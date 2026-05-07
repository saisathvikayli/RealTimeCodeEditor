import exp from "express"; // importing express
import { RoomModel } from "../models/RoomModel.js"; // importing room schema
import { v4 as uuidv4 } from "uuid"; // for generating unique room IDs

export const roomRouter = exp.Router(); // creating router instance

// CREATE ROOM
roomRouter.post("/create", async (req, res) => {
    try {
        const { createdBy } = req.body; // get username from request body
        const roomId = uuidv4().slice(0, 6).toUpperCase(); // generate short unique room ID like A7X92
        const newRoom = new RoomModel({ roomId, createdBy, participants: [createdBy] }); // create new room object
        await newRoom.save(); // save to MongoDB
        res.status(201).json({ message: "Room created successfully", roomId }); // send roomId to frontend
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message }); // catch any errors
    }
});

// GET ROOM DETAILS
roomRouter.get("/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params; // get roomId from URL
        const room = await RoomModel.findOne({ roomId }); // find room in DB
        if (!room) return res.status(404).json({ message: "Room not found" }); // if no room, stop here
        res.status(200).json({ message: "Room found", room }); // send room data
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message }); // catch any errors
    }
});

// JOIN ROOM
roomRouter.post("/:roomId/join", async (req, res) => {
    try {
        const { roomId } = req.params; // get roomId from URL
        const { username } = req.body; // get username from request body
        const room = await RoomModel.findOne({ roomId }); // find room in DB
        if (!room) return res.status(404).json({ message: "Room not found" }); // if no room, stop here
        if (!room.participants.includes(username)) { // check if user already in room
            room.participants.push(username); // add user to participants
            await room.save(); // save updated room
        }
        res.status(200).json({ message: "Joined room successfully", room }); // send room data
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message }); // catch any errors
    }
});

// DELETE ROOM
roomRouter.delete("/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params; // get roomId from URL
        const room = await RoomModel.findOneAndDelete({ roomId }); // find and delete room from DB
        if (!room) return res.status(404).json({ message: "Room not found" }); // if no room, stop here
        res.status(200).json({ message: "Room deleted successfully" }); // send success response
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message }); // catch any errors
    }
});