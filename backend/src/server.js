import http from "http";
import { config } from "dotenv";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import app from "./app.js";

import connectDB from "./config/db.js";

import socketHandler from "./sockets/socketHandler.js";

// load env
config();

// connect mongodb
connectDB();

// create express server
const server = http.createServer(app);

// socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// socket authentication middleware
io.use((socket, next) => {

  try {

    // token from client
    const token =
      socket.handshake
        .auth.token;

    // no token
    if (!token) {

      return next(
        new Error(
          "Unauthorized"
        )
      );
    }

    // verify token
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // attach user
    socket.user = decoded;

    console.log(
      "Authenticated User:",
      decoded.userId
    );

    next();

  } catch (error) {

    console.log(
      "SOCKET AUTH ERROR:"
    );

    console.log(error.message);

    next(
      new Error(
        "Invalid Token"
      )
    );
  }
});

// socket handler
socketHandler(io);

// server port
const PORT =
  process.env.PORT || 4000;

// start server
server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});