<template>
  <div class="Deck">
    <button :disabled="!isUserTurn" @click="$emit('draw')">
      <Card :text="cardsInDeck" />
    </button>
    <div v-if="isUserTurn">
      Click on deck
      <br />
      to pick card
    </div>
    <div v-else>
      Waiting for
      <br />
      {{ currentPlayer.substring(0, 8) }}
      <br />
      to pick card
    </div>
  </div>
</template>

<script>
import Card from "./Card";
export default {
  name: "Deck",
  props: {
    // drawCard: Function,
    isSpectator: Boolean,
    isUserTurn: Boolean,
    cardsInDeck: Number,
    currentPlayer: String
  },
  emits: ["draw"],
  components: {
    Card
  }
};
</script>

<style lang="scss">
@import "../styles/variables";
.Deck {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-flow: row wrap;
}
</style>
