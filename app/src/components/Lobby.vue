<template>
  <div class="Lobby">
    <h1>Game lobby</h1>
    <div class="Lobby__Info">
      {{ message }}
    </div>
    <div v-if="!isGameHost">
      <Spinner />
    </div>
    <div class="Lobby__Members">
      People in the lobby:
      <ul>
        <li v-for="user in users" :key="user">
          - {{ user }} <span v-if="user === userId">(you)</span>
          <span v-if="user === gameHostId">(host)</span>
        </li>
      </ul>
    </div>
    <div v-if="isGameHost" class="Lobby__Actions">
      <Button class="Lobby__Button" size="large" @click="$emit('reset-game')"
        >Start game</Button
      >
    </div>
  </div>
</template>

<script>
import Button from "../components/Button";
import Spinner from "../components/Spinner";
export default {
  name: "Lobby",
  components: {
    Button,
    Spinner
  },
  props: {
    userId: {
      type: String,
      default: null
    },
    gameHostId: {
      type: String,
      default: null
    },
    users: {
      type: Array,
      required: true
    },
    isGameInProgress: {
      type: Boolean,
      default: false
    }
  },
  emits: ["reset-game"],
  computed: {
    isGameHost() {
      return this.gameHostId === this.userId;
    },
    message() {
      if (this.isGameInProgress) {
        return "The game is in progress, waiting for the game host to restart the game.";
      } else {
        if (this.isGameHost)
          return "When everyone is ready, click the button to launch the game.";
        return "The game is about to start, waiting for the game host to launch the game.";
      }
    }
  }
};
</script>

<style lang="scss">
@import "../styles/variables";
.Lobby {
  &__Actions {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
  }

  &__Button {
    width: 50%;
  }

  &__Info {
    margin: $spacing-large 0;
  }

  &__Members {
    margin: $spacing-large 0;
  }
}
</style>
