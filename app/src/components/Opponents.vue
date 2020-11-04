<template>
  <div class="Opponents">
    <div v-for="player in players" :key="player.playerId">
      {{ player.playerId }}
      <div :class="['Player', { 'Player--Current': player.isCurrentPlayer }]">
        {{ player.cardCount }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Opponents',
  props: {
    players: Object
  }
};
</script>
<style lang="scss">
.Opponents {
  display: flex;
  align-items: center;
  justify-content: space-around;

  .Player {
    border: 0.1em solid black;
    height: 15em;
    display: flex;
    justify-content: center;
    align-items: center;
    &.Player--Current {
      border: 0.5em solid black;
    }
  }
}
</style>