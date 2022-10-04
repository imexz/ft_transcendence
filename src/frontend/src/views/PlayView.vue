<template>
  <div>
    <PongGame />
  </div>
</template>

<script lang="ts">

import PongGame from '@/components/Game/PongGame.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    PongGame,
  },
})

</script>