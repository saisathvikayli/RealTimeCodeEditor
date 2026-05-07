import axios from "axios";
import Room from "../models/Room.js";

const JUDGE0_URL =
  "https://ce.judge0.com/submissions";

const languageMap = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

// code events
const codeSocket = (io, socket) => {
  // sync code
  socket.on(
    "code:change",
    async ({
      roomId,
      code,
    }) => {
      try {
        await Room.updateOne(
          { roomId },
          { code }
        );

        socket.to(roomId).emit(
          "code:sync",
          {
            code,
          }
        );
      } catch (error) {
        socket.emit("error", {
          message:
            "Code sync failed",
        });
      }
    }
  );

  // run code
  socket.on(
    "code:run",
    async ({
      roomId,
      code,
      language,
      input,
    }) => {
      try {
        const language_id =
          languageMap[
            language
          ] || 63;

        const response =
          await axios.post(
            `${JUDGE0_URL}?base64_encoded=true&wait=true`,
            {
              source_code:
                Buffer.from(
                  code
                ).toString(
                  "base64"
                ),

              language_id,

              stdin:
                Buffer.from(
                  input || ""
                ).toString(
                  "base64"
                ),
            }
          );

        const result =
          response.data;

        const decode = (
          data
        ) =>
          data
            ? Buffer.from(
                data,
                "base64"
              ).toString(
                "utf-8"
              )
            : null;

        io.to(roomId).emit(
          "code:output",
          {
            output:
              decode(
                result.stdout
              ) ||
              "No output",

            error: decode(
              result.stderr
            ),

            status:
              result.status
                ?.description,
          }
        );
      } catch (error) {
        socket.emit("error", {
          message:
            "Code execution failed",
        });
      }
    }
  );
};

export default codeSocket;