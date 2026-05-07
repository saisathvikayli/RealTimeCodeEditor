 // cursor events
const cursorSocket = (
  io,
  socket
) => {
  socket.on(
    "cursor:move",
    ({
      roomId,
      line,
      column,
    }) => {
      socket.to(roomId).emit(
        "cursor:update",
        {
          userId:
            socket.id,

          line,
          column,
        }
      );
    }
  );
};

export default cursorSocket;