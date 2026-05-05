import exp from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./routes/authRoutes.js";
import { roomRouter } from "./routes/roomRoutes.js";



app.use("/api/auth", authRouter);
app.use("/api/room", roomRouter);
