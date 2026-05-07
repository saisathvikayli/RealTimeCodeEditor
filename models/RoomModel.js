import { Schema, model } from "mongoose";

const RoomSchema = new Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    language: {
        type: String,
        default: "javascript"
    },
    currentCode: {
        type: String,
        default: ""
    },
    createdBy: {
    type: String,
    required: true  // who created the room
    },
    participants: {
        type: [String],
        default: []
    }
}, { timestamps: true });

export default model("Room", RoomSchema);