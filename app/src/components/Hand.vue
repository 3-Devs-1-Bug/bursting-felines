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

    <p v-if="isUserTurn && isPerishPhase">
      You are about to die ! (autoresolve in {{ resolveCountdown }})
    </p>
    <p v-else-if="isUserDead">
      You died...
    </p>
  </div>
</template>

<script>
import { CardType } from "../bf-game";
import Card from "./Card";

export default {
  name: "Hand",
  components: {
    Card
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
    }
  },
  data() {
    return {
      CardType
    };
  }
};
</script>

<style lang="scss">
@import "../styles/variables";

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
