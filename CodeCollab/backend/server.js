import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { config } from "dotenv";
import aiRouter from "./routes/aiRoute.js";
import authRoutes from "./routes/authRoutes.js";
import roomRouter from "./routes/roomRoute.js";
import messageRouter from "./routes/messageRoute.js";
import userRouter from "./routes/userRoute.js";
import connectDB from "./config/db.js";
import socketHandler from "./sockets/socketHandler.js";
import router from "./routes/executeRoute.js";

config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRouter);
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRouter);
app.use("/api/messages", messageRouter);
app.use("/api/users", userRouter);
app.use("/api/code", router);

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});