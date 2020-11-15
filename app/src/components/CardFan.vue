<template>
  <div class="CardFan" :style="{ '--card-count': cardCount }">
    <Card
      v-for="i in cardCount"
      :key="i"
      class="CardFan__Card"
      :class="{ 'CardFan__Card--CurrentPlayer': isCurrentPlayer }"
      :style="{ '--card-index': i }"
    />
  </div>
</template>

<script>
import Card from "./Card";

export default {
  name: "CardFan",
  components: {
    Card
  },
  props: {
    cardCount: {
      type: Number,
      required: true
    },
    isCurrentPlayer: Boolean
  }
};
</script>

<style lang="scss">
@import "../styles/variables";

$angle-mod: 5deg;

.CardFan {
  position: relative;
  height: 10rem;

  &__Card {
    position: absolute;
    top: 0;
    left: 0;

    background-color: $color-background;

    transform-origin: center 200%;
    transform: rotate(
      calc(
        var(--card-count) / 2 * -#{$angle-mod} + var(--card-index) * #{$angle-mod}
      )
    );

    &:not(#{&}--CurrentPlayer) {
      border-style: dotted;
    }
  }
}
</style>
