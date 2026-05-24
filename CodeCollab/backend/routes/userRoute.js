import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Room from "../models/Room.js";
import Message from "../models/Message.js";

const router = express.Router();

// get a user's profile data with stats
router.get("/profile/:username", async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        // rooms this user created
        const createdRooms = await Room.find({ createdBy: username }).sort({ updatedAt: -1 });

        // rooms this user has joined (from their joinedRoomIds array)
        const joinedRooms = await Room.find({
            roomId: { $in: user.joinedRoomIds }
        }).sort({ updatedAt: -1 });

        // recent rooms (mix of created and joined, sorted by most recent activity)
        const allRoomsMap = new Map();
        [...createdRooms, ...joinedRooms].forEach(r => {
            allRoomsMap.set(r.roomId, r);
        });
        const recentRooms = Array.from(allRoomsMap.values())
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);

        // count chat messages sent by this user
        const messageCount = await Message.countDocuments({ sender: username });

        // collect languages used (from created rooms)
        const languageCounts = {};
        createdRooms.forEach(r => {
            const lang = r.language || "unknown";
            languageCounts[lang] = (languageCounts[lang] || 0) + 1;
        });

        res.status(200).json({
            message: "Profile fetched",
            profile: {
                username: user.username,
                email: user.email,
                memberSince: user.createdAt,
                stats: {
                    createdCount: createdRooms.length,
                    joinedCount: joinedRooms.length,
                    messageCount,
                    languageCounts
                },
                recentRooms
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// update user profile (email and password only - username is locked)
router.put("/profile/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const { email, newPassword, currentPassword } = req.body;

        if (!currentPassword) {
            return res.status(400).json({ message: "Current password is required" });
        }

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        // verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // update email if provided and changed
        if (email && email.trim() && email.trim().toLowerCase() !== user.email) {
            const existing = await User.findOne({ email: email.trim().toLowerCase() });
            if (existing) {
                return res.status(409).json({ message: "Email already in use" });
            }
            user.email = email.trim().toLowerCase();
        }

        // update password if provided
        if (newPassword && newPassword.trim()) {
            if (newPassword.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }
            const hashed = await bcrypt.hash(newPassword, 10);
            user.password = hashed;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated",
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;