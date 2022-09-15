<template>
  <div>
    <PongGame />
  </div>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import PongGame from '@/components/Game/PongGame.vue';

  @Options({
    components: {
      PongGame,
    }
  })

  export default class PlayView extends Vue {

  }
</script>