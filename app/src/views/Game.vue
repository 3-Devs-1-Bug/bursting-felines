<template>
  <div>This is the game page</div>

  <button @click="resetGame">Reset game</button>

  <hr />

  <template v-if="!isSpectator">
    <ul>
      <li v-for="(card, i) in playerCards" :key="i + card">
        <button v-if="card !== CardType.Resurect" :disabled="!isUserTurn">
          Play card
        </button>
        {{ card }}
      </li>
    </ul>
  </template>

  <button v-if="!isSpectator" :disabled="!isUserTurn" @click="drawCard">
    Pick a card
  </button>

  <hr />
  <code>
    <pre>{{ roomJson }}</pre>
  </code>
  <hr />
  <code>
    <pre>{{ gameJson }}</pre>
  </code>
</template>

<script>
import { mapActions, mapState } from "vuex";

import { getCurrentPlayerId, CardType } from "../bf-game";

export default {
  name: "GameView",
  data() {
    return {
      CardType
    };
  },
  mounted() {
    this.joinGame();
  },
  computed: {
    ...mapState(["gameState", "room", "userId"]),
    gameJson() {
      return JSON.stringify(this.gameState, null, 2);
    },
    roomJson() {
      return JSON.stringify(this.room, null, 2);
    },
    isSpectator() {
      if (!this.gameState) {
        return true;
      }
      return !this.gameState.players.includes(this.userId);
    },
    playerCards() {
      if (!this.gameState || this.isSpectator) {
        return [];
      }
      return this.gameState.hands[this.userId];
    },
    currentPlayer() {
      if (!this.gameState) {
        return null;
      }
      return getCurrentPlayerId(this.gameState);
    },
    isUserTurn() {
      return this.currentPlayer === this.userId;
    }
  },

  methods: {
    ...mapActions(["joinGame", "resetGame", "drawCard"])
  }
};
</script>
