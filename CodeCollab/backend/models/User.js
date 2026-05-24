import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required:[true, "username is required"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required:[true , "Email required"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    joinedRoomIds: {
  type: [String],
  default: []
    }
}, {
  timestamps:true,
  versionKey:false,
  strict:"throw"
});

export default model("User", UserSchema);