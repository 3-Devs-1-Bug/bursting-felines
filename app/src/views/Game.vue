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

  <!-- TODO: move somewhere else and make it pretty -->
  <template v-if="!isSpectator">
    <ul class="cards">
      <li v-for="(card, i) in playerCards" :key="i + card">
        <Button v-if="card === CardType.Resurect" :disabled="!isPerishPhase">
          Do not die
        </Button>
        <Button v-else-if="card !== CardType.Perish" :disabled="!isUserTurn">
          Play card
        </Button>
        <span
          class="card-name"
          :class="{ 'card-name--perish': card === CardType.Perish }"
        >
          {{ card }}
        </span>
      </li>
    </ul>

    <p v-if="isUserTurn && isPerishPhase">
      You are about to die ! (autoresolve in {{ resolveCountdown }})
    </p>
    <p v-else-if="isUserDead">
      You died...
    </p>
  </template>

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

import { getCurrentPlayerId, CardType, GamePhase } from "../bf-game";

export default {
  name: "GameView",
  data() {
    return {
      CardType,
      resolveCountdown: 0
    };
  },
  mounted() {
    this.joinGame();
  },
  components: {
    Opponents,
    Deck,
    Button
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
      return this.gameState?.statuses[this.userId];
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
.cards {
  display: grid;
  gap: 0.5rem;
}

.card-name--perish {
  color: red;
}
</style>
