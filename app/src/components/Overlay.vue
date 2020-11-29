<template>
  <div class="Overlay">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Overlay"
};
</script>

<style lang="scss">
.Overlay {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
