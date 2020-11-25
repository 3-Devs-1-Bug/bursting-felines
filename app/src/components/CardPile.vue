<template>
  <div class="CardPile">
    <Card class="CardPile__Card" is-place-holder />

    <!-- <transition-group name="fade" appear> -->
    <Card
      v-for="(card, i) in reversedCards"
      :key="card.type + i"
      :type="faceDown ? undefined : card.type"
      :text="faceDown ? '' : card.text"
      class="CardPile__Card"
      :style="{
        '--card-offset-x': offsets[i].x,
        '--card-offset-y': offsets[i].y,
        '--card-offset-angle': offsets[i].angle
      }"
    />
    <!-- </transition-group> -->
  </div>
</template>

<script>
import { CardType } from "../bf-game/types";
import Card from "./Card";

export default {
  name: "CardPile",
  components: { Card },
  props: {
    cards: {
      type: Array,
      required: true
    },
    faceDown: Boolean,
    isMessy: Boolean
  },
  data() {
    return {
      CardType,
      offsets: this.cards.map((card, index) => this.getOffset(index))
    };
  },
  computed: {
    reversedCards() {
      const result = this.cards.slice();
      result.reverse();
      return result;
    }
  },
  watch: {
    cards(newValue) {
      if (newValue.length > this.offsets.length) {
        // must generate more offsets
        const nbItemToGenerate = newValue.length - this.offsets.length;
        for (let i = 0; i < nbItemToGenerate; i++) {
          this.offsets.push(this.getOffset(i));
        }
      } else if (newValue.length < this.offsets.length) {
        // must remove some offsets
        const nbItemToDelele = this.offsets.length - newValue.length;
        this.offsets.splice(
          this.offsets.length - nbItemToDelele,
          nbItemToDelele
        );
      }
    }
  },
  methods: {
    getOffset(index) {
      if (this.isMessy) {
        return {
          x: -1 + Math.random() * 2,
          y: -1 + Math.random() * 2,
          angle: -1 + Math.random() * 2
        };
      } else {
        return {
          x: 1 - index * 0.15,
          y: 1 - index * 0.15,
          angle: 0
        };
      }
    }
  }
};
</script>

<style lang="scss">
$max-translate-offset: 0.5rem;
$max-rotate-offset: 10deg;

.CardPile {
  position: relative;
  height: 9.375rem;
  width: 6.25rem;

  &__Card {
    position: absolute;
    transform: translateX(calc(var(--card-offset-x) * #{$max-translate-offset}))
      translateY(calc(var(--card-offset-y) * #{$max-translate-offset}))
      rotate(calc(var(--card-offset-angle) * #{$max-rotate-offset}));
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(1.4);
}
</style>
