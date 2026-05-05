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
    participants: {
        type: [String],
        default: []
    }
}, { timestamps: true });

export default model("Room", RoomSchema);