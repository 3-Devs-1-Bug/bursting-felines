<template v-if="!isSpectator">
  <div>
    <ul class="Cards">
      <li v-for="(card, i) in playerCards" :key="i + card">
        <Card
          tag="button"
          :disabled="isCardDisabled(card)"
          :type="card"
          text="Lorem Ipsum"
          @click="$emit('play-card', { userId, card })"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { CardType, GamePhase } from "../bf-game";
import Card from "./Card";

export default {
  name: "Hand",
  components: {
    Card
  },
  props: {
    isUserTurn: Boolean,
    currentPhase: {
      type: String,
      default: null,
      validator: value => Object.values(GamePhase).includes(value)
    },
    playerCards: {
      type: Array,
      required: true,
      validator: value =>
        value.every(item => Object.values(CardType).includes(item))
    },
    cardsInDeck: {
      type: Number,
      default: 0
    },
    userId: {
      type: String,
      required: true
    }
  },
  emits: ["play-card"],
  data() {
    return {
      CardType,
      GamePhase
    };
  },
  methods: {
    isCardDisabled(card) {
      // every cards are disabled when it's not the players turn (for now)
      if (!this.isUserTurn) {
        // if player is beeing looted, he can select a card
        if (this.currentPhase === GamePhase.ResolvingLoot) {
          return false;
        } else return true;
      }

      // resurect cards can only be played during the ResolvingPerish phase
      if (
        card === CardType.Resurect &&
        this.currentPhase !== GamePhase.ResolvingPerish
      ) {
        return true;
      }

      // Perish cards just kill you 🤷‍♂️
      if (card === CardType.Perish) {
        return true;
      }

      return false;
    }
  }
};
</script>

<style lang="scss">
@import "../styles/variables";

.Cards {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: row wrap;

  > * {
    margin: 0.25rem;
  }
}
</style>
