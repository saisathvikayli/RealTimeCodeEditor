import Room from "../models/Room.js";
import Message from "../models/Message.js";
import axios from "axios";

const safe = (socket, fn) => async (...args) => {
  try {
    await fn(...args);
  } catch (err) {
    console.error("Socket Error:", err.message);
    socket.emit("error", err.message);
  }
};

const JUDGE0_URL = "https://ce.judge0.com/submissions";
const headers = { "Content-Type": "application/json" };

const languageMap = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

// store username per socket id in memory
const socketUserMap = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // join an existing room
    socket.on(
      "room:join",
      safe(socket, async ({ roomId, username }) => {
        const room = await Room.findOne({ roomId });
        if (!room) return socket.emit("error", "Room not found");

        socket.join(roomId);
        socketUserMap.set(socket.id, { roomId, username });

        // remove any old entries with the same username
        await Room.updateOne(
          { roomId },
          { $pull: { users: { username } } }
        );

        // add fresh entry
        await Room.updateOne(
          { roomId },
          { $push: { users: { socketId: socket.id, username } } }
        );

        const updatedRoom = await Room.findOne({ roomId });

        // broadcast to everyone in the room (including sender)
        io.to(roomId).emit("room:users", updatedRoom.users);
        socket.emit("code:sync", { code: updatedRoom.code });

        const messages = await Message.find({ roomId })
          .sort({ createdAt: 1 })
          .limit(50);

        socket.emit("chat:history", messages);
        socket.to(roomId).emit("activity:log", `${username} joined`);
      })
    );

    // leave a room
    socket.on(
      "room:leave",
      safe(socket, async ({ roomId }) => {
        await handleLeave(socket, roomId, io);
      })
    );

    // sync code change
    socket.on(
      "code:change",
      safe(socket, async ({ roomId, code }) => {
        await Room.updateOne({ roomId }, { code });
        socket.to(roomId).emit("code:sync", { code });
      })
    );

    // change language for the whole room
  socket.on(
  "language:change",
  safe(socket, async ({ roomId, language, code }) => {
    await Room.updateOne({ roomId }, { language, code });
    socket.to(roomId).emit("language:sync", { language, code });
  })
);

    // broadcast cursor position
    socket.on("cursor:move", ({ roomId, line, column, username }) => {
      socket.to(roomId).emit("cursor:update", {
        socketId: socket.id,
        username,
        line,
        column,
      });
    });

    // chat message
    socket.on(
      "chat:send",
      safe(socket, async ({ roomId, text, sender }) => {
        const msg = await Message.create({ roomId, sender, text });

        io.to(roomId).emit("chat:message", {
          sender,
          text,
          ts: msg.createdAt,
        });
      })
    );

    // run code via judge0
    socket.on(
      "code:run",
      safe(socket, async ({ roomId, code, language, input }) => {
        let sourceCode = code;

        if (!sourceCode) {
          const room = await Room.findOne({ roomId });
          if (!room) return socket.emit("error", "Room not found");
          sourceCode = room.code;
          language = room.language;
        }

        const language_id = languageMap[language] || 63;
        io.to(roomId).emit("activity:log", "running code...");

        try {
          const response = await axios.post(
            `${JUDGE0_URL}?base64_encoded=true&wait=true`,
            {
              source_code: Buffer.from(sourceCode).toString("base64"),
              language_id,
              stdin: Buffer.from(input || "").toString("base64"),
            },
            { headers }
          );

          const result = response.data;
          const decode = (data) =>
            data ? Buffer.from(data, "base64").toString("utf-8") : null;

          const output =
            decode(result.stdout) ||
            decode(result.stderr) ||
            decode(result.compile_output) ||
            "No output";

          const status =
            result.status?.description ||
            (result.stderr && "Runtime Error") ||
            (result.compile_output && "Compilation Error") ||
            "Unknown";

          io.to(roomId).emit("code:output", {
            output,
            error: result.stderr || null,
            compile_output: result.compile_output || null,
            status,
          });
        } catch (err) {
          console.error("Execution Error:", err.message);
          io.to(roomId).emit("code:output", {
            output: null,
            error: "Execution failed",
            status: "Error",
          });
        }
      })
    );

    // handle disconnect
    socket.on("disconnect", async () => {
      console.log("Disconnected:", socket.id);
      const info = socketUserMap.get(socket.id);
      if (info) {
        await handleLeave(socket, info.roomId, io, info.username);
        socketUserMap.delete(socket.id);
      }
    });
  });
};

// remove user from room
const handleLeave = async (socket, roomId, io, knownUsername) => {
  socket.leave(roomId);

  let username = knownUsername;
  if (!username) {
    const info = socketUserMap.get(socket.id);
    username = info?.username;
  }

  // remove this specific socket entry
  await Room.updateOne(
    { roomId },
    { $pull: { users: { socketId: socket.id } } }
  );

  const room = await Room.findOne({ roomId });
  if (!room) return;

  io.to(roomId).emit("room:users", room.users);
  if (username) {
    socket.to(roomId).emit("activity:log", `${username} left`);
  }
};

export default socketHandler;