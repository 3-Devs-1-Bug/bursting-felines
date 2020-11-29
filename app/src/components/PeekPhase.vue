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
          '--peek-phase-card-index': i
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
  emits: ["dismiss"]
};
</script>

<style lang="scss">
$max-translate-offset: 0.5rem;
// adjust these variables
$interval-x: -10rem;
$interval-y: -2rem;
$offset-x: 10rem;
.PeekPile {
  display: flex;
  align-items: center;
  justify-content: center;
  &__Card {
    transform: translateX(
        calc(var(--peek-phase-card-index) * #{$interval-x} + #{$offset-x})
      )
      translateY(calc(var(--peek-phase-card-index) * #{$interval-y}));
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
