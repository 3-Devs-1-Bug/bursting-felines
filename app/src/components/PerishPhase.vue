<template>
  <div v-if="currentPhase === GamePhase.ResolvingPerish">
    Quick ! Use your Resurect card ! You will die in {{ resolveCountdown }}
  </div>
  <div
    v-if="currentPhase === GamePhase.InsertingPerishCard"
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
</template>

<script>
import { GamePhase } from "../bf-game";
import Button from "../components/Button";
export default {
  name: "PerishPhase",
  components: {
    Button
  },
  props: {
    currentPhase: {
      type: String,
      default: null,
      validator: value => Object.values(GamePhase).includes(value)
    },
    cardsInDeck: {
      type: Number,
      default: 0
    },
    resolveCountdown: {
      type: Number,
      required: true
    },
    playerCount: {
      type: Number,
      default: 0
    }
  },
  emits: {
    insertPerish: perishNewIndex => {
      if (perishNewIndex) {
        return true;
      } else {
        console.warn("Invalid insertPerish event payload!");
        return false;
      }
    }
  },
  data() {
    return {
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
    }
  }
};
</script>

<style lang="scss">
.PerishChoice {
  * + * {
    margin-left: 0.4em;
    margin-bottom: 0.4em;
  }
}
</style>
