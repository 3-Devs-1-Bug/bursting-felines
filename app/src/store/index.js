import { createStore } from "vuex";
import io from "socket.io-client";

import * as BF from "../bf-game";
import { SERVER_URL } from "../config";

const store = createStore({
  state: {
    gameState: null,
    room: null,
    userId: null
  },
  mutations: {
    SET_GAME_STATE(state, game) {
      state.gameState = game;
    },
    SET_ROOM_STATE(state, room) {
      state.room = room;
    },
    SET_USER_ID(state, id) {
      state.userId = id;
    }
  },
  actions: {
    /** Reset the game to its initial state and send the update to the server. */
    resetGame({ commit, state: { room } }) {
      const playerIds = room.users;
      const newGame = BF.createNewGame(playerIds);

      return new Promise(resolve => {
        socket.emit("game:update", newGame, () => {
          commit("SET_GAME_STATE", newGame);
          resolve(newGame);
        });
      });
    },

    /** Fetch the current game state from the server */
    joinGame({ commit }) {
      return new Promise(resolve => {
        socket.emit("game:join", gameState => {
          commit("SET_GAME_STATE", gameState);
          resolve(gameState);
        });
      });
    },

    /** Update the game state and send the update to the server. */
    updateGame({ commit }, newState) {
      return new Promise(resolve => {
        socket.emit("game:update", newState, () => {
          commit("SET_GAME_STATE", newState);
          resolve(newState);
        });
      });
    },

    /** Make the current player draw a card from the deck. */
    drawCard({ state: { gameState }, dispatch }) {
      const playerId = socket.id;
      const newState = BF.drawCard(gameState, playerId);
      return dispatch("updateGame", newState);
    },

    solvePerish({ state: { gameState }, dispatch }) {
      return dispatch("updateGame", BF.solvePerish(gameState));
    }
  },
  modules: {}
});

const socket = io(SERVER_URL);

socket.on("connect", () => {
  store.commit("SET_USER_ID", socket.id);
});

socket.on("game:update", newState => {
  store.commit("SET_GAME_STATE", newState);
});

socket.on("room:update", newRoom => {
  store.commit("SET_ROOM_STATE", newRoom);
});

export default store;
