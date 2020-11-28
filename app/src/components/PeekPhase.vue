<template>
  <div>
    These are the top 3 cards in the deck, ou have {{ countdown }} seconds left
  </div>
  <Button @click="$emit('dismiss')">Dismiss</Button>
  <div>
    <ul class="Cards">
      <li v-for="card in cards" :key="card.id">
        <Card
          tag="button"
          :disabled="true"
          :type="card.type"
          :text="card.text"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import Card from "../components/Card";
import Button from "../components/Button";
export default {
  name: "PeekPhase",
  components: {
    Card,
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

<style></style>
