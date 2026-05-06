import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { config } from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import socketHandler from "./sockets/socketHandler.js";
import router from "./routes/executeRoute.js";

config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/code", router);
// DB
connectDB();

const server = http.createServer(app);

// Socket
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketHandler(io);



const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});