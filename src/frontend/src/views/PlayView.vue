<template>
  <div class="gameWrapper">
    <div class="gameHeader"></div>
    <div class="game">
      <!-- <PongGame /> -->
      <GameMenu/>
    </div>
  </div>
</template>

<script lang="ts">

import PongGame from '@/components/Game/PongGame.vue';
import { defineComponent } from 'vue';
import GameMenu from '@/components/Game/GameMenu.vue';

export default defineComponent({
  components: {
    PongGame,
    GameMenu
}
})

</script>

<style scoped>

.gameWrapper {
  margin: auto;
  margin-top: 80px;
  margin-bottom: 80px;
  width: 800px;
}

/* .gameHeader {
  width: 100%;
  height: 170px;
  border: 2px solid var(--ft_cyan);
  border-radius: 10px 10px 0px 0px;
} */
/* .game {
  width: 100%;
  height: 800px;
  border: 2px solid var(--ft_cyan);
  border-radius: 10px;
} */
</style>