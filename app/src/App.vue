<template>
  <router-view />
</template>

<style lang="scss">
@import "styles/reset";
@import "styles/fonts";
@import "styles/variables";
@import "styles/typography";
@import "styles/helpers";

body {
  padding: 1rem;
  @include desktop {
    padding: 1rem 24rem;
  }
}
</style>
