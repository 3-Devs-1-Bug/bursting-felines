<template v-if="!isSpectator">
  <div>
    <ul class="Cards">
      <li v-for="(card, i) in playerCards" :key="i + card">
        <button v-if="card === CardType.Resurect" :disabled="!isPerishPhase">
          <Card class="Resurect" :text="card" />
        </button>
        <button v-else-if="card !== CardType.Perish" :disabled="!isUserTurn">
          <Card :class="card" :text="card" />
        </button>
      </li>
    </ul>

    <div v-if="isUserTurn && isPerishPhase" class="PerishChoice">
      <div>
        You almost died ! Luckily, you had a Resurect card. Where do you want to
        re-insert the Perish card ?
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
      You died...
    </p>
  </div>
</template>

<script>
import { CardType } from "../bf-game";
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
    isPerishPhase: Boolean,
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
  emits: ["insert-perish"],
  data() {
    return {
      CardType
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
  justify-content: space-around;
  flex-flow: row wrap;
}

.Perish {
  color: $color-red;
}
.Resurect {
  color: $color-green;
}
.Skip {
  color: $color-light-yellow;
}
.Attack {
  color: $color-orange;
}
.Loot {
  color: $color-purple;
}
.Deny {
  color: $color-yellow;
}
.Shuffle {
  color: $color-blue;
}
.Peek {
  color: $color-purple;
}
.Combo1 {
  color: $color-light-blue;
}
.Combo2 {
  color: $color-light-blue;
}
.Combo3 {
  color: $color-light-blue;
}
.Combo4 {
  color: $color-light-blue;
}
.Combo5 {
  color: $color-light-blue;
}
</style>
