import { Schema,model } from "mongoose";
// stores room files
const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    default: "",
  },
});

// stores active users in room
const roomUserSchema = new  Schema({
  socketId: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },
});

// main room schema
const roomSchema = new Schema(
  {
    // unique room id
    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    // selected language
    language: {
      type: String,
      default: "javascript",
    },

    // active editor code
    code: {
      type: String,
      default: "",
    },

    // multiple files support
    files: [fileSchema],

    // connected users
    users: [roomUserSchema],

    // room creator
    owner: {
      type:Schema.Types.ObjectId,
      ref: "User",
    },

    // public/private room
    isPublic: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

const Room = model(
  "Room",
  roomSchema
);

export default Room;