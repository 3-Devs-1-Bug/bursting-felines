<template>
  <div class="Opponents">
    <div v-for="player in players" :key="player.playerId">
      {{ player.playerId.substring(0, 8) }}
      <CardFan
        :card-count="player.cardCount"
        :is-current-player="player.isCurrentPlayer"
      />
    </div>
  </div>
</template>

<script>
import CardFan from "./CardFan";

export default {
  name: "Opponents",
  components: {
    CardFan
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
  margin: 2rem;

  .Player--Current {
    border-style: dotted;
  }
}
</style>
