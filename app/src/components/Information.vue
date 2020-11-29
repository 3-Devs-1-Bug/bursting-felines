<template>
  <div class="Information">
    {{ gameInfo }}
  </div>
</template>

<script>
import { GamePhase } from "../bf-game";
export default {
  name: "Information",
  props: {
    isUserTurn: Boolean,
    currentPlayer: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    gameState: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    gameInfo() {
      if (!this.gameState) return "";

      if (this.gameState.specialPhase === GamePhase.ResolvingLoot) {
        if (this.userId === this.gameState.lootTargetId) {
          const looter = this.gameState.looterId.substring(0, 8);
          return `${looter} is looting you, select a card to give away`;
        } else if (this.userId === this.gameState.looterId) {
          const target = this.gameState.lootTargetId.substring(0, 8);
          return `Waiting for ${target} to give you a card`;
        }
      }

      const shortName = this.currentPlayer.substring(0, 8);

      if (this.gameState.specialPhase === GamePhase.Peeking) {
        const subject = this.isUserTurn ? "You are" : `${shortName} is`;
        return `${subject} peeking the deck`;
      }

      if (this.isUserTurn) {
        let message = `It's your turn`;
        const { attackCards } = this.gameState;
        if (attackCards > 0) {
          const attacks = attackCards > 1 ? ` ${attackCards} times` : "";
          message += ` (you have been attacked${attacks})`;
        }
        return message;
      } else return `Waiting for ${shortName} to play`;
    }
  }
};
</script>

<style lang="scss">
@import "../styles/variables";
.Information {
  display: flex;
  justify-content: center;
  margin: $spacing-regular 0;
}
</style>
