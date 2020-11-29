<template>
  <div class="Overlay">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Overlay",
  mounted() {
    document.body.style.overflowY = "hidden";
  },
  beforeUnmount() {
    document.body.style.overflowY = "";
  }
};
</script>

<style lang="scss">
.Overlay {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
