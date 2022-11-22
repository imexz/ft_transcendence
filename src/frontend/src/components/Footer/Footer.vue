<template>
  <div class="footer">
      <AskForGame v-if="this.$store.state.requester != null"/>
      <Toast/>
      <FriendList v-if="$store.state.validated"></FriendList>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import FriendList from '@/components/Footer/FriendList.vue';
import AskForGame from '@/components/Game/AskForGame.vue'
import Toast from '@/components/Footer/Toast.vue'

export default defineComponent({
  components: {
    FriendList,
    AskForGame,
    Toast,
  }
})
</script>

<style scoped>
  .footer {
    --dark: var(--ft_dark);
    --cold: var(--ft_cyan);
    --hot: var(--ft_pink);
    z-index: 11;
    position: fixed;
    bottom: 0px;
    width: 100%;
  }
</style>
