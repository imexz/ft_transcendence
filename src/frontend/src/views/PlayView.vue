<template>
  <div>
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
},
})

</script>
