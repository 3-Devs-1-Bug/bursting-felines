<template>
  <div>This is the game page</div>
  <button @click="resetGame">Reset game</button>
  <button @click="drawCard">Pick a card</button>
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
    ...mapState(["gameState"]),
    gameJson() {
      return JSON.stringify(this.gameState, null, 2);
    }
  },
  methods: {
    ...mapActions(["joinGame", "resetGame", "drawCard"])
  }
};
</script>
