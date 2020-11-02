<template>
  <div>This is the game page</div>
  <button @click="resetGame">Reset game</button>
  <button :disabled="isSpectator" @click="drawCard">Pick a card</button>
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

export default {
  name: "GameView",
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
      return !Object.keys(this.gameState.players).includes(this.userId);
    }
  },
  methods: {
    ...mapActions(["joinGame", "resetGame", "drawCard"])
  }
};
</script>
