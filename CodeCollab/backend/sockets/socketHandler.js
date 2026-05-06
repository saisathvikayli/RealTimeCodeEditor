import Room from "../models/Room.js";
import Message from "../models/Message.js";
import axios from "axios";

// =========================
// SAFE WRAPPER
// =========================
const safe = (socket, fn) => async (...args) => {
  try {
    await fn(...args);
  } catch (err) {
    console.error("Socket Error:", err.message);
    socket.emit("error", err.message);
  }
};

// =========================
// JUDGE0 CONFIG
// =========================
const JUDGE0_URL = "https://ce.judge0.com/submissions";

const headers = {
  "Content-Type": "application/json",
};
// =========================
// LANGUAGE MAP
// =========================
const languageMap = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

// =========================
// SOCKET HANDLER
// =========================
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // =========================
    // ROOM CREATE
    // =========================
    socket.on(
      "room:create",
      safe(socket, async ({ roomId, username }) => {
        const exists = await Room.findOne({ roomId });

        if (exists) {
          return socket.emit("error", "Room already exists");
        }

        const room = await Room.create({
          roomId,
          code: "",
          language: "javascript",
          users: [{ socketId: socket.id, username }],
        });

        socket.join(roomId);

        socket.emit("room:users", room.users);
        socket.emit("code:sync", { code: room.code });

        console.log(`Room created: ${roomId}`);
      })
    );

    // =========================
    // ROOM JOIN
    // =========================
    socket.on(
      "room:join",
      safe(socket, async ({ roomId, username }) => {
        let room = await Room.findOne({ roomId });

        if (!room) {
          room = await Room.create({
            roomId,
            code: "",
            language: "javascript",
            users: [],
          });
        }

        socket.join(roomId);

        await Room.updateOne(
          { roomId },
          {
            $addToSet: {
              users: { socketId: socket.id, username },
            },
          }
        );

        const updatedRoom = await Room.findOne({ roomId });

        socket.emit("room:users", updatedRoom.users);
        socket.emit("code:sync", { code: updatedRoom.code });

        const messages = await Message.find({ roomId })
          .sort({ createdAt: 1 })
          .limit(50);

        socket.emit("chat:history", messages);

        socket.to(roomId).emit("activity:log", `${username} joined`);
      })
    );

    // =========================
    // ROOM LEAVE
    // =========================
    socket.on(
      "room:leave",
      safe(socket, async ({ roomId }) => {
        await handleLeave(socket, roomId, io);
      })
    );

    // =========================
    // CODE CHANGE
    // =========================
    socket.on(
      "code:change",
      safe(socket, async ({ roomId, code }) => {
        await Room.updateOne({ roomId }, { code });
        socket.to(roomId).emit("code:sync", { code });
      })
    );

    // =========================
    // CURSOR MOVE
    // =========================
    socket.on("cursor:move", ({ roomId, line, column }) => {
      socket.to(roomId).emit("cursor:update", {
        userId: socket.id,
        line,
        column,
      });
    });

    // =========================
    // CHAT SEND
    // =========================
    socket.on(
      "chat:send",
      safe(socket, async ({ roomId, text, sender }) => {
        const msg = await Message.create({
          roomId,
          sender,
          text,
        });

        io.to(roomId).emit("chat:message", {
          userId: socket.id,
          sender,
          text,
          ts: msg.createdAt,
        });
      })
    );

    // =========================
    // 🚀 CODE RUN (MAIN FEATURE)
    // =========================
    socket.on(
  "code:run",
  safe(socket, async ({ roomId, code, language, input }) => {
    let sourceCode = code;

    // =========================
    // GET CODE FROM ROOM IF EMPTY
    // =========================
    if (!sourceCode) {
      const room = await Room.findOne({ roomId });
      if (!room) return socket.emit("error", "Room not found");

      sourceCode = room.code;
      language = room.language;
    }

    const language_id = languageMap[language] || 63;

    io.to(roomId).emit("activity:log", "⚡ Running code...");

    console.log("Sending to Judge0...");
    console.log("Language:", language);
    console.log("Code:\n", sourceCode);

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
      // =========================
      // SAFE STATUS
      // =========================
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

      if (err.response) {
        console.error("API Error:", err.response.data);
      }

      io.to(roomId).emit("code:output", {
        output: null,
        error: "Execution failed",
        status: "Error",
      });
    }
  })
);
    // =========================
    // DISCONNECTING
    // =========================
    socket.on("disconnecting", async () => {
      for (let roomId of socket.rooms) {
        if (roomId !== socket.id) {
          await handleLeave(socket, roomId, io);
        }
      }
    });

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
};

// =========================
// HANDLE LEAVE
// =========================
const handleLeave = async (socket, roomId, io) => {
  socket.leave(roomId);

  await Room.updateOne(
    { roomId },
    { $pull: { users: { socketId: socket.id } } }
  );

  const room = await Room.findOne({ roomId });
  if (!room) return;

  socket.to(roomId).emit("activity:log", `${socket.id} left`);
  io.to(roomId).emit("room:users", room.users);

  if (room.users.length === 0) {
    await Room.deleteOne({ roomId });
    console.log(`Room deleted: ${roomId}`);
  }
};

export default socketHandler;