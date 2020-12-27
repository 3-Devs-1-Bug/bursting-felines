<template>
  <!-- 
    For some reason, route transition is all fucked up if we dont wrap the 
    whole view in a single element.
  -->
  <div>
    <h1>Bursting felines</h1>
    <h2>Presentation</h2>
    <p>
      Bursting Felines is a clone of a game called "Exploding Kittens".
    </p>
    <div class="play">
      <router-link to="/game/123">
        <Button size="large">
          Play now
        </Button>
      </router-link>
    </div>
    <h2>Contribute</h2>
    <p>
      The source code is available on its
      <a href="https://github.com/3-Devs-1-Bug/bursting-felines">
        Github Repository</a
      >.
    </p>

    <h2>TODO</h2>
    <ul class="todolist">
      <li><del>Main game loop</del></li>
      <li><del>Perish card</del></li>
      <li><del>Skip card</del></li>
      <li><del>Resurect card</del></li>
      <li><del>Shuffle card</del></li>
      <li><del>Deny card</del></li>
      <li><del>Attack card</del></li>
      <li><del>Loot card</del></li>
      <li><del>Peek card</del></li>
      <li>Combo cards</li>
      <li>Handle the endgame</li>
      <li>Private lobby system</li>
      <li>Handle disconnections</li>
    </ul>
  </div>
</template>

<script>
import Button from "../components/Button";
export default {
  name: "Home",
  components: {
    Button
  }
};
</script>

<style lang="scss">
.todolist {
  list-style: disc;
  padding-left: 1rem;

  del {
    color: grey;
    text-decoration: line-through;
  }
}
.play {
  padding: 2em 0;
  display: flex;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
