<template>
  <button v-if="!isCollapsed" @click="toggleFriendList" class="friendListButton">^</button>
  <button v-else @click="toggleFriendList" class="friendListButtonPassive friendListButton">Friends</button>
  <div v-show="!isCollapsed" class="friendList">
    <div class="headline">Friends</div>
    <div class="friends">
      <UserSummary
      v-for="user in users"
      :user = user as User ></UserSummary>
    </div>
  </div>
</template>

<script lang="ts">
import UserSummary from '@/components/Profile/UserSummary.vue';
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { defineComponent } from 'vue';
import User from '@/models/user'

export default defineComponent({
  data() {
    return {
      isCollapsed: true as boolean,
      users : [] as User[],
    }
  },
  methods: {
    toggleFriendList(): void {
      this.isCollapsed = !this.isCollapsed;
    }
  },
  mounted() {
    VueAxios({
      url: '/users/friends',
      baseURL: API_URL,
      method: 'GET',
      withCredentials: true,
    })
      .then(response => { this.users = response.data })
      .catch()
  },
  components: {
    UserSummary,
  }
})

</script>

<style scoped>
  .friendList {
    --dark: var(--ft_dark);
    --cold: var(--ft_cyan);
    --hot: var(--ft_pink);
    width: 340px;
    height: 600px;
    position: absolute;
    background-color: var(--dark);
    bottom: 82px;
    border: 2px solid var(--cold);
    border-bottom: none;
    border-radius: 10px 10px 0px 0px;
    margin-left: 20px;
    animation: growUp 300ms ease-in-out forwards;
    transform-origin: bottom center;
  }

  .friendListButton {
    position: absolute;
    left: 20px;
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