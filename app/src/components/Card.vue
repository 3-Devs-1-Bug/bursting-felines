<template>
  <div class="Card">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    text: {
      type: [String, Number],
      required: false,
      default: null
    }
  }
};
</script>

<style lang="scss">
@import "../styles/variables";
.Card {
  border: 0.2em inset $color-primary;
  color: $color-primary;
  display: flex;
  min-height: 8em;
  min-width: 5em;
  justify-content: center;
  align-items: center;
  margin: 0.3em;
}
</style>
