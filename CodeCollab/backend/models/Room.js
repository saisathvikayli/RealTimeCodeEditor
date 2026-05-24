import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: String,
    socketId: String
});

const RoomSchema = new Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
     createdBy: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        default: "Unnamed Room"
    },
    roomPassword: {
        type: String,
        default: ""
    },
    language: {
        type: String,
        default: "javascript"
    },
    code: {
        type: String,
        default: ""
    },
    users: {
        type: [userSchema],
        default: []
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw"
});

export default model("Room", RoomSchema);