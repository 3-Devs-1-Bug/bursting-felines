<template>
  <div>This is the game page</div>

  <button @click="resetGame">Reset game</button>

  <hr />

  <h2>Opponents</h2>
  <Opponents :players="opponents"/>

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
import Opponents from "../components/Opponents";

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
  components: {
    Opponents
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
    },
    opponents() {
      if (!this.gameState) {
        return [];
      }
      const opponents = [];

      for(var playerId in this.gameState.hands){
        if(playerId === this.userId)
          continue;
        opponents.push({
          playerId,
          cardCount: this.gameState.hands[playerId].length,
          isCurrentPlayer: this.currentPlayer === playerId
        })
      }
      
      return opponents;
    }
  },

  methods: {
    ...mapActions(["joinGame", "resetGame", "drawCard"])
  }
};
</script>
