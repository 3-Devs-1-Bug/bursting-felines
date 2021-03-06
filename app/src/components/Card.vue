<template>
  <component
    :is="tag"
    class="Card"
    :class="{
      ['Card--' + type]: type,
      'Card--Placeholder': isPlaceHolder
    }"
  >
    <div class="Card__Text">
      {{ text }}
    </div>
    <div v-if="type" class="Card__Type">
      {{ type }}
    </div>
    <div
      v-if="hasRevealAnimation && type !== CardType.Resurect"
      class="Card__Overlay"
    />
  </component>
</template>

<script>
import { CardType } from "../bf-game/types";

export default {
  name: "Card",
  props: {
    text: {
      type: [String, Number],
      required: false,
      default: null
    },
    type: {
      type: [String, undefined],
      required: false,
      default: null,
      validator: value => Object.values(CardType).includes(value)
    },
    tag: {
      type: String,
      required: false,
      default: "div"
    },
    isPlaceHolder: {
      type: Boolean,
      required: false,
      default: false
    },
    hasRevealAnimation: {
      type: Boolean,
      required: false,
      default: false
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
@use "sass:color";
@import "../styles/variables";

@mixin card-colors-style($card-color) {
  color: $card-color;
  border-color: $card-color;

  .Card__Text {
    background-color: color.adjust($card-color, $alpha: -0.9);
  }

  .Card__Type {
    background-color: $card-color;
    color: color.adjust($card-color, $lightness: -25%, $alpha: -0.2);
  }
}

$card-colors: (
  Perish: $color-red,
  Resurect: $color-green,
  Skip: $color-light-yellow,
  Attack: $color-orange,
  Loot: $color-light-purple,
  Deny: $color-yellow,
  Shuffle: $color-blue,
  Peek: $color-purple,
  Combo1: $color-light-blue,
  Combo2: $color-light-blue,
  Combo3: $color-light-blue,
  Combo4: $color-light-blue,
  Combo5: $color-light-blue
);

.Card {
  position: relative;
  background-color: $color-background;
  border: 0.2rem solid $color-primary;
  border-radius: 0.4rem;
  color: $color-primary;
  display: flex;
  flex-direction: column;
  height: 9.375rem;
  width: 6.25rem;
  padding: 0;
  transition: transform 0.075s ease-in-out;
  box-shadow: 0 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);

  &__Text {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.875rem;
    color: $color-primary;
    padding: 0.5rem;
    width: 100%;
  }

  &__Type {
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.125rem;
    font-weight: 600;
    width: 100%;
  }

  &--Placeholder {
    border: 0.2rem dashed $color-primary;
  }

  @each $card-type, $card-color in $card-colors {
    &--#{$card-type} {
      @include card-colors-style($card-color);
    }
  }

  &__Overlay {
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
    animation: shrink 5s forwards;
    position: absolute;
  }

  @keyframes shrink {
    from {
      transform: scaleY(1);
    }
    to {
      transform: scaleY(0);
    }
  }
}

button.Card {
  &:hover,
  &:focus {
    transform: translateY(-0.5rem);
  }
}
</style>
