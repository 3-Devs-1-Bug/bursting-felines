const Server = require("socket.io");

const { PORT } = require("./config");

const io = new Server({
  serveClient: false
});

const defaultRoom = "game-001";

const state = {
  game: null,
  room: {
    users: []
  }
};

const removePlayer = (userId, state) => {
  state.players = state.players.filter(id => id !== userId);
  delete state.statuses[userId];
  delete state.hands[userId];
  return state;
};

io.on("connection", socket => {
  console.log("User connected", socket.id);

  // for now, everyone joins the same room
  socket.join(defaultRoom, () => {
    state.room.users.push(socket.id);
    io.to(defaultRoom).emit("room:update", state.room);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    state.room.users = state.room.users.filter(id => id !== socket.id);
    socket.to(defaultRoom).emit("room:update", state.room);

    if (state.game) {
      state.game = removePlayer(socket.id, state.game);
      socket.to(defaultRoom).emit("game:update", state.game);
    }
  });

  socket.on("game:join", cb => {
    console.log(socket.id, "game:join");
    cb(state.game);
  });

  socket.on("game:update", (newGameState, cb) => {
    console.log(socket.id, "game:update", newGameState);
    state.game = newGameState;
    // propagate the update to everyone in the room
    socket.to(defaultRoom).emit("game:update", newGameState);
    cb();
  });
});

io.listen(PORT);
