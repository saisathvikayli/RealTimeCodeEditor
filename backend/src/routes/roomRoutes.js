import express from "express";

import {
  createRoom,
  getRoom,
  getAllRooms,
  deleteRoom,
} from "../controllers/roomController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// create room
router.post(
  "/create",
  authMiddleware,
  createRoom
);

// get single room
router.get("/:roomId", getRoom);

// get all rooms
router.get("/", getAllRooms);

// delete room
router.delete(
  "/:roomId",
  authMiddleware,
  deleteRoom
);

export default router;