<template>
  <div class="wrapper">    
    <button 
      v-if="!isCollapsed"
      @click="toggleFriendList"
      class="friendListButton">
      ^</button>
    <button
      v-else
      @click="toggleFriendList"
      class="friendListButtonPassive friendListButton">
      Friends({{ $store.getters.getFriends?.length }})</button>
    <div v-show="!isCollapsed" class="friendList">
      <!-- <div class="headline">
        <span>
          Friends({{ $store.getters.getFriends?.length }})
        </span>
      </div> -->
      <button
        @click="toggleFriendList"
        class="friendListButton friendListButtonActive">
      Friends({{ $store.getters.getFriends?.length }})</button>
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

  .wrapper {
    --dark: var(--ft_dark);
    --cold: var(--ft_cyan);
    --hot: var(--ft_pink);
    position: absolute;
    right: 0px;
    top: 0px;
    height: 0px;
  }
  .friendList {
    width: 340px;
    height: 600px;
    position: relative;
    background-color: var(--dark);
    top: -666px;
    border: 2px solid var(--cold);
    border-bottom: none;
    border-radius: 10px 10px 0px 0px;
    animation: growUp 200ms ease-in-out forwards;
    transform-origin: bottom center;
  }

  .friendListButton {
    position: relative;
    top: -2px;
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
  .friendListButtonActive {
    position: relative;
    left: -2px;
    top: -2px;
    border-radius: 10px 10px 0px 0px;
  }
  .headline {
    align-items: center;
    justify-content: center;
    display: flex ;
    height: 62px;
    font-size: 25px;
    font-weight: bold;
    border-bottom: 2px solid var(--cold);
  }
  .friends {
    overflow-y: auto;
    margin-top: -2px;
    height: calc(600px - 64px);
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