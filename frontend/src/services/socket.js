import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {

  if (socket) {
    return socket;
  }

  socket = io(
    "http://localhost:4000",
    {
      transports: ["websocket"],

      autoConnect: true,
    }
  );

  socket.on(
    "connect",
    () => {

      console.log(
        "SOCKET CONNECTED:",
        socket.id
      );
    }
  );

  socket.on(
    "disconnect",
    () => {

      console.log(
        "SOCKET DISCONNECTED"
      );
    }
  );

  socket.on(
    "connect_error",
    (err) => {

      console.log(
        "SOCKET ERROR:",
        err.message
      );
    }
  );

  return socket;
};

export const getSocket =
  () => socket;