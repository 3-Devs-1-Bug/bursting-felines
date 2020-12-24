<template>
  <div>This is the game page</div>

  <Button @click="resetGame">Reset game</Button>

  <hr />

  <template v-if="gameState">
    <Opponents :players="opponents" />
    <div class="GameBoard">
      <button :disabled="!isUserTurn" @click="drawCard">
        <CardPile :cards="gameState.deck" :face-down="true" />
      </button>
      <CardPile :cards="gameState.discardPile" :is-messy="true" />
    </div>

    <Information
      :is-user-turn="isUserTurn"
      :user-id="userId"
      :game-state="gameState"
      :current-player="currentPlayer"
    />
    <Hand
      :is-user-turn="isUserTurn"
      :current-phase="currentPhase"
      :player-cards="playerCards"
      :user-id="userId"
      :is-submitting="isSubmitting"
      @play-card="submitCard"
    />
    <div v-if="isUserTurn && currentPhase">
      <PerishPhase
        v-if="
          currentPhase === GamePhase.ResolvingPerish ||
            currentPhase === GamePhase.InsertingPerishCard
        "
        :current-phase="currentPhase"
        :player-count="playerCount"
        :cards-in-deck="cardsInDeck"
        :resolve-countdown="resolveCountdown"
        @insert-perish="insertPerish"
      />
      <LootPhase
        v-if="currentPhase === GamePhase.ChoosingLootTarget"
        :opponents="opponentsAlive"
        @set-loot-target="setLootTarget"
      />
      <PeekPhase
        v-if="currentPhase === GamePhase.Peeking"
        :cards="top3cardsInDeck"
        :countdown="peekTimeLeft"
        @dismiss="resetPhase"
      />
    </div>
  </template>

  <p v-if="isUserDead">
    You died a terrible death...
  </p>

  <template v-if="isDebug">
    <hr />
    <div>
    {{ `Card validated in ${submitTimeLeft}, is submitting: ${isSubmitting}` }}
    </div>
    <code>
      <pre>{{ roomJson }}</pre>
    </code>

    <hr />
    <code>
      <pre>{{ gameJson }}</pre>
    </code>
  </template>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Opponents from "../components/Opponents";
import Information from "../components/Information";
import Button from "../components/Button";
import Hand from "../components/Hand";
import CardPile from "../components/CardPile";
import PerishPhase from "../components/PerishPhase";
import LootPhase from "../components/LootPhase";
import PeekPhase from "../components/PeekPhase";

import {
  getCurrentPlayerId,
  getOpponentsAlive,
  PlayerStatus,
  GamePhase
} from "../bf-game";

export default {
  name: "GameView",

  components: {
    Opponents,
    Information,
    Button,
    Hand,
    CardPile,
    PerishPhase,
    LootPhase,
    PeekPhase
  },

  data() {
    return {
      peekTimeLeft: 0,
      resolveCountdown: 0,
      submitTimeLeft: 0,
      perishCountdown: null,
      GamePhase
    };
  },

  computed: {
    isDebug() {
      return process.env.NODE_ENV === "development" || this.$route.query.debug;
    },
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
    currentPhase() {
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
    },
    opponentsAlive() {
      if (!this.gameState) {
        return [];
      }
      return getOpponentsAlive(this.gameState);
    },
    top3cardsInDeck() {
      const top3 = this.gameState?.deck.slice(0, 3);
      top3.reverse();
      return top3;
    },
    isPeekPhase() {
      return this.gameState?.specialPhase === GamePhase.Peeking;
    },
    isSubmitting() {
      return this.gameState?.isSubmitting;
    },
    shouldResetTimer() {
      return this.gameState?.timerRandom;
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
    },
    isPeekPhase(value, oldValue) {
      if (!value) clearInterval(this.peekCountDown);
      if (this.isUserTurn && value && !oldValue) {
        this.peekTimeLeft = 999;

        const timer = () => {
          if (this.peekTimeLeft <= 0) {
            this.resetPhase();
            clearInterval(this.peekCountDown);
            return;
          }
          this.peekTimeLeft--;
        };

        this.peekCountDown = setInterval(timer, 1000);
      }
    },
    isSubmitting(isSubmitting) {
      // always clear old timer
      clearInterval(this.submitCountDown);
      if (isSubmitting) {
        this.submitTimeLeft = 4;
        this.submitCountDown = setInterval(this.getTimer, 1000);
      }
    },
    shouldResetTimer() {
      clearInterval(this.submitCountDown);
      this.submitTimeLeft = 4;
      this.submitCountDown = setInterval(this.getTimer, 1000);
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
      "playCard",
      "setLootTarget",
      "resetPhase",
      "submitCard"
    ]),
    getTimer() {
      if (this.submitTimeLeft <= 0) {
        clearInterval(this.submitCountDown);
        if (this.isUserTurn) this.playCard(this.userId);
        return;
      }
      this.submitTimeLeft--;
    }
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
