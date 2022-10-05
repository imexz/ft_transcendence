<template>
  <div class="wrapper">    
    <button v-if="!isCollapsed" @click="toggleFriendList" class="friendListButton">^</button>
    <button v-else @click="toggleFriendList" class="friendListButtonPassive friendListButton">Friends</button>
    <div v-show="!isCollapsed" class="friendList">
      <div class="headline">Friends</div>
      <div class="friends">
        <UserSummary
        v-for="user in $store.getters.getFriends"
        :user = user as User ></UserSummary>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import UserSummary from '@/components/Profile/UserSummary.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      isCollapsed: true as boolean,
    }
  },
  methods: {
    toggleFriendList(): void {
      this.isCollapsed = !this.isCollapsed;
    }
  },
  mounted() {
    this.$store.dispatch('getFriendsList')
  },
  components: {
    UserSummary,
  }
})

</script>

<style scoped>

  /* .wrapper {
    position: relative;
  } */
  .friendList {
    --dark: var(--ft_dark);
    --cold: var(--ft_cyan);
    --hot: var(--ft_pink);
    width: 340px;
    height: 600px;
    position: r;
    background-color: var(--dark);
    bottom: 82px;
    right: 20px;
    border: 2px solid var(--cold);
    border-bottom: none;
    border-radius: 10px 10px 0px 0px;
    margin-left: 20px;
    animation: growUp 300ms ease-in-out forwards;
    transform-origin: bottom center;
  }

  .friendListButton {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 344px;
    height: 62px;
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    color: var(--cold);
    border: 2px solid var(--cold);
    border-radius: 0px 0px 10px 10px;
    background-color: var(--dark);
    vertical-align: middle;
  }

  .friendListButtonPassive {
    border-radius: 10px;

  }
  .headline {
    height: 62px;
    font-size: 25px;
    font-weight: bold;
    padding: 10px 25px;
    border-bottom: 2px solid var(--cold);
  }
  .friends {
    overflow: auto;
  }
  
  @keyframes growUp {
    0% {
      transform: scaleY(0)
    }
    100% {
      transform: scaleY(1)
    }
  }
</style>