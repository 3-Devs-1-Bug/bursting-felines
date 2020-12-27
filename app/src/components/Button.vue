<template>
  <button :class="['Button', `Button--${size}`]" v-bind="$attrs">
    <slot />
  </button>
</template>

<script>
const sizes = {
  small: "small",
  large: "large"
};

export default {
  name: "Button",
  props: {
    size: {
      type: String,
      default: sizes.small,
      required: false,
      validator: size => Object.values(sizes).indexOf(size) > -1
    }
  }
};
</script>

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

  &.Button--large {
    min-height: 1.5em;
    font-size: 1.5em;
  }
}
</style>
