<template>
  <div>This is the game page</div>

  <Button @click="resetGame">Reset game</Button>

  <hr />

  <template v-if="gameState">
    <Opponents :players="opponents" />
    <div class="GameBoard">
      <Card
        tag="button"
        :disabled="!isUserTurn"
        :text="cardsInDeck"
        @click="drawCard"
      />
      <CardPile :cards="gameState.discardPile" />
    </div>
    <Information :is-user-turn="isUserTurn" :current-player="currentPlayer" />
  </template>

  <Hand
    :is-user-dead="isUserDead"
    :is-user-turn="isUserTurn"
    :game-phase="gamePhase"
    :player-cards="playerCards"
    :resolve-countdown="resolveCountdown"
    :player-count="playerCount"
    :cards-in-deck="cardsInDeck"
    @play-card="playCard"
    @insert-perish="insertPerish"
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
import Information from "../components/Information";
import Button from "../components/Button";
import Hand from "../components/Hand";
import Card from "../components/Card";
import CardPile from "../components/CardPile";

import { getCurrentPlayerId, PlayerStatus, GamePhase } from "../bf-game";

export default {
  name: "GameView",

  components: {
    Opponents,
    Information,
    Button,
    Hand,
    Card,
    CardPile
  },

  data() {
    return {
      resolveCountdown: 0,
      perishCountdown: null
    };
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
    gamePhase() {
      return this.gameState?.specialPhase;
    },
    isPerishPhase() {
      return this.gameState?.specialPhase === GamePhase.ResolvingPerish;
    },
    isUserDead() {
      return this.gameState?.statuses[this.userId] == PlayerStatus.Dead;
    },
    playerCount() {
      return this.gameState?.players.length;
    },
    lastDiscardedCard() {
      return this.gameState?.discardPile[0];
    }
  },

  watch: {
    isPerishPhase(value, oldValue) {
      if (!value) clearInterval(this.perishCountdown);

      if (this.isUserTurn && value && !oldValue) {
        this.resolveCountdown = 1000;

        const timer = () => {
          if (this.resolveCountdown <= 0) {
            this.perish();
            clearInterval(this.perishCountdown);
            return;
          }
          this.resolveCountdown--;
        };

        this.perishCountdown = setInterval(timer, 10);
      }
    }
  },

  mounted() {
    this.joinGame();
  },

  methods: {
    ...mapActions([
      "joinGame",
      "resetGame",
      "drawCard",
      "insertPerish",
      "perish",
      "playCard"
    ])
  }
};
</script>

<style lang="scss">
@import "../styles/variables";
.GameBoard {
  display: flex;
  justify-content: center;

  > * {
    margin: 2rem;
  }
}
</style>
