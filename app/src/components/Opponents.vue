<template>
  <div class="Opponents">
    <div v-for="player in players" :key="player.playerId">
      {{ player.playerId.substring(0,8) }}
      <div :class="['Player', { 'Player--Current': player.isCurrentPlayer }]">
        {{ player.cardCount }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Opponents",
  props: {
    players: Object
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

  .Player {
    border: 0.2em inset $color-primary;
    display: flex;
    min-height: 8em;
    min-width: 5em;
    justify-content: center;
    align-items: center;
    margin: 0.3em;
    &.Player--Current {
      border: 0.3em dotted $color-primary;
    }
  }
}
</style>