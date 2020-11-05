<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/game/123">Game</router-link>
  </nav>
  <router-view />
</template>

<style lang="scss">
@import "styles/reset";
@import "styles/fonts";
@import "styles/variables";
@import "styles/typography";
</style>
