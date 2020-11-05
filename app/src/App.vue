<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/game/123">Game</router-link>
  </nav>
  <router-view />
</template>
<style lang="scss">
@import "styles/variables";
body {
  background-color: $color-background;
  color: $color-primary;
  font-family: $font-family-regular;
}
</style>