import exp from "express"; // importing express
import { MessageModel } from "../models/MessageModel.js"; // importing message schema

export const messageRouter = exp.Router(); // creating router instance

// GET ALL MESSAGES FOR A ROOM
messageRouter.get("/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params; // get roomId from URL
        const messages = await MessageModel.find({ roomId }); // find all messages for this room
        res.status(200).json({ message: "Messages fetched", messages }); // send messages to frontend
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message }); // catch any errors
    }
});

// SAVE A NEW MESSAGE
messageRouter.post("/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params; // get roomId from URL
        const { sender, text } = req.body; // get sender and text from request body
        const newMessage = new MessageModel({ roomId, sender, text }); // create new message object
        await newMessage.save(); // save to MongoDB
        res.status(201).json({ message: "Message saved", newMessage }); // send saved message
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message }); // catch any errors
    }
});