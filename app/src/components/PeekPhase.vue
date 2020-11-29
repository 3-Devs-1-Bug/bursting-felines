<template>
  <Overlay>
    <div class="PeekPile">
      <Card
        v-for="(card, i) in cards"
        :key="card.id"
        :type="card.type"
        :text="card.text"
        class="PeekPile__Card"
        :style="{
          '--card-offset-x': getOffset(i).x,
          '--card-offset-y': getOffset(i).y
        }"
      />
    </div>
    <div class="Info">
      <div>These are the next three cards ({{ countdown }})</div>
      <Button @click="$emit('dismiss')">Ok</Button>
    </div>
  </Overlay>
</template>

<script>
import Card from "../components/Card";
import Overlay from "../components/Overlay";
import Button from "../components/Button";
export default {
  name: "PeekPhase",
  components: {
    Card,
    Overlay,
    Button
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
        x: index * -22 + 20,
        y: index * -4
      };
    }
  }
};
</script>

<style lang="scss">
$max-translate-offset: 0.5rem;
.PeekPile {
  display: flex;
  align-items: center;
  justify-content: center;
  &__Card {
    transform: translateX(calc(var(--card-offset-x) * #{$max-translate-offset}))
      translateY(calc(var(--card-offset-y) * #{$max-translate-offset}));
  }
}
.Info {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  margin-top: 10%;
}
</style>
