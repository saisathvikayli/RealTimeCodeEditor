import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  transports: ["websocket"],
});

const ROOM_ID = "test-room";
const USERNAME = "Lokesh";

// =========================
// CONNECT
// =========================
socket.on("connect", () => {
  console.log("🔌 Connected:", socket.id);
  runTests();
});

// =========================
// TEST FLOW
// =========================
async function runTests() {
  try {
    // =========================
    // ROOM CREATE
    // =========================
    console.log("\n➡️ Creating room...");
    socket.emit("room:create", {
      roomId: ROOM_ID,
      username: USERNAME,
    });

    await wait(1000);

    // =========================
    // ROOM JOIN
    // =========================
    console.log("\n➡️ Joining room...");
    socket.emit("room:join", {
      roomId: ROOM_ID,
      username: "Jay",
    });

    await wait(1000);

    // =========================
    // CODE CHANGE
    // =========================
    const code = `
console.log("Hello from CodeCollab 🚀");
console.log("2 + 2 =", 2 + 2);
`;

    console.log("\n➡️ Sending code update...");
    socket.emit("code:change", {
      roomId: ROOM_ID,
      code,
    });

    await wait(1000);

    // =========================
    // RUN CODE (FIXED)
    // =========================
    console.log("\n➡️ Running code...");
    socket.emit("code:run", {
      roomId: ROOM_ID,
      code: code,        // ✅ send code
      language: 63       // ✅ JavaScript
    });

  } catch (err) {
    console.error("Test Error:", err);
  }
}

// =========================
// LISTENERS
// =========================
socket.on("room:users", (users) => {
  console.log("👥 room:users →", users);
});

socket.on("code:sync", (data) => {
  console.log("💻 code:sync →", data);
});

socket.on("chat:message", (msg) => {
  console.log("💬 chat:message →", msg);
});

socket.on("cursor:update", (cursor) => {
  console.log("🖱️ cursor:update →", cursor);
});

socket.on("activity:log", (msg) => {
  console.log("📢 activity:log →", msg);
});

// =========================
// 🧾 CODE OUTPUT LISTENER (IMPORTANT)
// =========================
socket.on("code:output", (data) => {
  console.log("\n🧾 ===== CODE OUTPUT =====");

  if (data.output) console.log("✅ Output:\n", data.output);
  if (data.error) console.log("❌ Error:\n", data.error);
  if (data.compile_output) console.log("⚠️ Compile:\n", data.compile_output);

  console.log("📌 Status:", data.status);
  console.log("🧾 =======================\n");
});

// =========================
// ERROR
// =========================
socket.on("error", (err) => {
  console.error("❌ error →", err);
});

// =========================
// HELPER
// =========================
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}