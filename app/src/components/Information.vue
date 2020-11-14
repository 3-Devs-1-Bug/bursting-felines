<template>
  <div class="Information">
    {{ gameInfo }}
  </div>
</template>

<script>
export default {
  name: "Information",
  props: {
    isUserTurn: Boolean,
    currentPlayer: {
      type: String,
      required: true
    }
  },
  computed: {
    gameInfo() {
      if (this.isUserTurn) return "It's your turn";
      else return `Waiting for ${this.currentPlayer.substring(0, 8)} to play`;
    }
  }
};
</script>

<style lang="scss">
@import "../styles/variables";
.Information {
  display: flex;
  justify-content: center;
  margin: $spacing-regular 0;
}
</style>
