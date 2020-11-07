<template>
  <div>This is the game page</div>

  <Button @click="resetGame">Reset game</Button>

  <hr />

  <template v-if="gameState">
    <Opponents :players="opponents" />
    <Deck
      @draw="drawCard"
      :isSpectator="isSpectator"
      :isUserTurn="isUserTurn"
      :cardsInDeck="cardsInDeck"
      :currentPlayer="currentPlayer"
    />
  </template>

  <Hand
    :isUserDead="isUserDead"
    :isUserTurn="isUserTurn"
    :isPerishPhase="isPerishPhase"
    :playerCards="playerCards"
    :resolveCountdown="resolveCountdown"
  />

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
import Deck from "../components/Deck";
import Button from "../components/Button";
import Hand from "../components/Hand";

import { getCurrentPlayerId, GamePhase, PlayerStatus } from "../bf-game";

export default {
  name: "GameView",
  data() {
    return {
      resolveCountdown: 0
    };
  },
  mounted() {
    this.joinGame();
  },
  components: {
    Opponents,
    Deck,
    Button,
    Hand
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

      for (var playerId in this.gameState.hands) {
        if (playerId === this.userId) continue;
        opponents.push({
          playerId,
          cardCount: this.gameState.hands[playerId].length,
          isCurrentPlayer: this.currentPlayer === playerId
        });
      }

      return opponents;
    },
    cardsInDeck() {
      if (!this.gameState) {
        return 0;
      }
      return this.gameState.deck.length;
    },
    isPerishPhase() {
      return this.gameState?.specialPhase === GamePhase.ResolvingPerish;
    },
    isUserDead() {
      return this.gameState?.statuses[this.userId] == PlayerStatus.Dead;
    }
  },

  methods: {
    ...mapActions(["joinGame", "resetGame", "drawCard", "solvePerish"])
  },

  watch: {
    isPerishPhase(value, oldValue) {
      if (this.isUserTurn && value && !oldValue) {
        this.resolveCountdown = 3;
        const cb = () => {
          this.resolveCountdown--;
          if (this.resolveCountdown > 0) {
            setTimeout(cb, 1000);
          } else {
            this.solvePerish();
          }
        };
        setTimeout(cb, 1000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
