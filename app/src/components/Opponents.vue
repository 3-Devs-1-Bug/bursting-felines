<template>
  <div class="Opponents">
    <div v-for="player in players" :key="player.playerId">
      {{ player.playerId.substring(0, 8) }}
      <Card
        :text="player.cardCount"
        :class="{ 'Player--Current': player.isCurrentPlayer }"
      />
    </div>
  </div>
</template>

<script>
import Card from "./Card";

export default {
  name: "Opponents",
  components: {
    Card
  },
  props: {
    players: {
      type: Array,
      required: true,
      // TODO: add Player object validator
      validator: value => value.every(item => typeof item === "object")
    }
  }
};
</script>
<style lang="scss">
@import "../styles/variables";
.Opponents {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-flow: row wrap;

  .Player--Current {
    border-style: dotted;
  }
}
</style>
