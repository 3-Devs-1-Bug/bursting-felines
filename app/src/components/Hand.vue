<template v-if="!isSpectator">
  <div>
    <ul class="Cards">
      <li v-for="(card, i) in playerCards" :key="i + card">
        <Card
          tag="button"
          :disabled="isCardDisabled(card)"
          :type="card"
          text="Lorem Ipsum"
          @click="$emit('play-card', card)"
        />
      </li>
    </ul>

    <div v-if="isUserTurn && gamePhase === GamePhase.ResolvingPerish">
      Quick ! Use your Resurect card ! You will die in {{ resolveCountdown }}
    </div>

    <div
      v-if="isUserTurn && gamePhase === GamePhase.InsertingPerishCard"
      class="PerishChoice"
    >
      <div>
        Wow, that was close ! Where do you want to re-insert the Perish card ?
      </div>
      <div>
        <Button @click="$emit('insert-perish', 0)">On top</Button>
        <Button
          v-for="index in playerCount"
          :key="index"
          @click="$emit('insert-perish', index)"
          >Position {{ index }}</Button
        >
        <Button @click="$emit('insert-perish', lastIndex)">On bottom</Button>
        <Button @click="insertPerishAtRandom">Random</Button>
      </div>
    </div>

    <p v-else-if="isUserDead">
      You died a terrible death...
    </p>
  </div>
</template>

<script>
import { CardType, GamePhase } from "../bf-game";
import Card from "./Card";
import Button from "./Button";

export default {
  name: "Hand",
  components: {
    Card,
    Button
  },
  props: {
    isUserDead: Boolean,
    isUserTurn: Boolean,
    gamePhase: {
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
    resolveCountdown: {
      type: Number,
      required: true
    },
    playerCount: {
      type: Number,
      default: 0
    },
    cardsInDeck: {
      type: Number,
      default: 0
    }
  },
  emits: ["insert-perish", "play-card"],
  data() {
    return {
      CardType,
      GamePhase
    };
  },
  computed: {
    lastIndex() {
      return this.deckCount - 1;
    }
  },
  methods: {
    insertPerishAtRandom() {
      this.$emit("insert-perish", Math.floor(Math.random() * this.cardsInDeck));
    },
    isCardDisabled(card) {
      // every cards are disabled when it's not the players turn (for now)
      if (!this.isUserTurn) {
        return true;
      }

      // resurect cards can only be played during the ResolvingPerish phase
      if (
        card === CardType.Resurect &&
        this.gamePhase !== GamePhase.ResolvingPerish
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

.PerishChoice {
  * + * {
    margin-left: 0.4em;
    margin-bottom: 0.4em;
  }
}

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
