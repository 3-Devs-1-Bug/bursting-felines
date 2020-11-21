<template>
  <div>
    Choose a opponent to steal a card from !
  </div>

  <Button
    v-for="opponent in opponents"
    :key="opponent"
    @click="$emit('set-loot-target', opponent)"
    >{{ opponent.substring(0, 8) }}</Button
  >
</template>

<script>
import Button from "../components/Button";
export default {
  name: "LootPhase",
  components: {
    Button
  },
  props: {
    opponents: {
      type: Array,
      default: () => []
    }
  },
  emits: ["set-loot-target"]
};
</script>

<style></style>
