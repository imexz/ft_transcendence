<template>
  <div class="footer">
    Hello World
    <div class="dropUp">
      <FriendList></FriendList>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import FriendList from '@/components/Footer/FriendList.vue';

export default defineComponent({
  components: {
    FriendList,
  }
})

</script>

<style scoped>
  .footer {
    --dark: var(--ft_dark);
    --cold: var(--ft_cyan);
    --hot: var(--ft_pink);
    position: fixed;
    bottom: 0px;
    height: 62px;
    width: 100%;
    background-color: var(--dark);
    border-top: 2px solid var(--hot);
  }
</style>