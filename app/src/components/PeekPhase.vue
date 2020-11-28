<template>
  <div class="PeekPile">
    <Card
      v-for="(card, i) in cards"
      :key="card.id"
      tag="button"
      :disabled="true"
      :type="card.type"
      :text="card.text"
      class="PeekPile__Card"
      :style="{
        '--card-offset-x': getOffset(i).x,
        '--card-offset-y': getOffset(i).y
      }"
    />
  </div>
</template>

<script>
import Card from "../components/Card";
export default {
  name: "PeekPhase",
  components: {
    Card
  },
  props: {
    cards: {
      type: Array,
      default: () => []
    },
    countdown: {
      type: Number,
      default: 0
    }
  },
  emits: ["dismiss"],
  methods: {
    getOffset(index) {
      return {
        x: index * -1,
        y: index * -4,
        angle: 0
      };
    }
  }
};
</script>

<style lang="scss">
$max-translate-offset: 0.5rem;
.PeekPile {
  position: relative;
  height: 9.375rem;
  width: 6.25rem;

  &__Card {
    position: absolute;
    transform: translateX(calc(var(--card-offset-x) * #{$max-translate-offset}))
      translateY(calc(var(--card-offset-y) * #{$max-translate-offset}));
  }
}
</style>
