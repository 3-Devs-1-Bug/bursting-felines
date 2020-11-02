import { createStore } from "vuex";
import io from "socket.io-client";
import * as BF from "../bf-game";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Conected to server", socket.id);
});

const store = createStore({
  state: {
    gameState: null
  },
  mutations: {
    SET_GAME_STATE(state, game) {
      state.gameState = game;
    }
  },
  actions: {
    /** Reset the game to its initial state and send the update to the server. */
    resetGame({ commit }) {
      const newGame = BF.createNewGame(["player-1", "player-2"]);

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
      const newState = BF.drawCard(gameState);
      return dispatch("updateGame", newState);
    }
  },
  modules: {}
});

socket.on("game:update", newState => {
  store.commit("SET_GAME_STATE", newState);
});

export default store;
