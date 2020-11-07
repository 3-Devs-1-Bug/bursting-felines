<template>
  <button class="Button" v-bind="$attrs">
    <slot />
  </button>
</template>

<style lang="scss">
@import "../styles/variables";
.Button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: $color-primary;
  min-height: 0.25em; // 4px
  border: 0.1em solid $color-primary;
  border-radius: 0.2em;

  &:disabled {
    color: adjust-color($color: $color-primary, $lightness: -50%);
  }
}
</style>
