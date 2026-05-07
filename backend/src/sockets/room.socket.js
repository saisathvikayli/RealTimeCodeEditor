import Room from "../models/Room.js";

// room events
const roomSocket = (
  io,
  socket
) => {

  // create room
  socket.on(
    "room:create",
    async ({
      roomId,
      username,
    }) => {

      try {

        const exists =
          await Room.findOne({
            roomId,
          });

        if (exists) {
          return socket.emit(
            "error",
            {
              message:
                "Room already exists",
            }
          );
        }

        const room =
          await Room.create({
            roomId,

            language:
              "javascript",

            code: "",

            files: [
              {
                name:
                  "main.js",

                content: "",
              },
            ],

            users: [
              {
                socketId:
                  socket.id,

                username,
              },
            ],
          });

        socket.join(roomId);

        io.to(roomId).emit(
          "room:users",
          room.users || []
        );

        io.to(roomId).emit(
          "files:sync",
          {
            files:
              room.files || [],
          }
        );

        console.log(
          "Room created:",
          roomId
        );

      } catch (error) {

        console.log(
          "ROOM CREATE ERROR:"
        );

        console.log(error);

        socket.emit("error", {
          message:
            "Failed to create room",
        });
      }
    }
  );

  // join room
  socket.on(
    "room:join",
    async ({
      roomId,
      username,
    }) => {

      try {

        const room =
          await Room.findOne({
            roomId,
          });

        if (!room) {
          return socket.emit(
            "error",
            {
              message:
                "Room not found",
            }
          );
        }

        socket.join(roomId);

        room.users.push({
          socketId:
            socket.id,

          username,
        });

        await room.save();

        io.to(roomId).emit(
          "room:users",
          room.users || []
        );

        io.to(roomId).emit(
          "activity:log",
          `${username} joined`
        );

      } catch (error) {

        console.log(
          "ROOM JOIN ERROR:"
        );

        console.log(error);

        socket.emit("error", {
          message:
            "Join room failed",
        });
      }
    }
  );
};

export default roomSocket;