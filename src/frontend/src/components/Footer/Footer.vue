<template>
  <div class="footer">
      <AskForGame v-if="this.$store.state.gameRequest != null"/>
      <FriendList v-if="$store.state.validated"></FriendList>
      <PendingGameRequest v-if="$store.state.pendingRequest"></PendingGameRequest>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import FriendList from '@/components/Footer/FriendList.vue';
import AskForGame from '@/components/Game/AskForGame.vue'
import PendingGameRequest from '../Game/PendingGameRequest.vue';

export default defineComponent({
  components: {
    FriendList,
    AskForGame,
    PendingGameRequest
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
    /* height: 62px; */
    width: 100%;
    /* background-color: var(--dark);
    border-top: 2px solid var(--hot); */
  }
</style>