<template>
  <div class="gameWrapper">
    <PongGame />
	<!-- <GameMenu /> -->
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
  margin-top: 80px;
}
</style>