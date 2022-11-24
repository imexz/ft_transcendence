<template>
  <div class="wrapper">    
    <button 
      v-if="!isCollapsed"
      @click="toggleFriendList"
      class="friendListButton">
      <font-awesome-icon icon="fa-solid fa-chevron-up" />
    </button>
    <button
      v-else
      @click="toggleFriendList"
      class="friendListButtonPassive friendListButton">
      <div class="text">
          <div>
            Friends
          </div>
          <div class="countBubble">
            {{ $store.state.friendsList?.length }}
          </div>
        </div>
      <div v-if="$store.state.NrFriendRequests" class="notificationCount">
        {{ $store.state.NrFriendRequests }}
      </div>
    </button>
    <div v-show="!isCollapsed" class="friendList">
      <button
        @click="toggleFriendList"
        class="friendListButton friendListButtonActive">
        <div class="text">
          <div>
            Friends
          </div>
          <div class="countBubble">
            {{ $store.state.friendsList?.length }}
          </div>
        </div>
      </button>
      <div class="friends">
        <div 
          v-if="$store.state.friendsList?.some((user)=>{
            return user.friendStatus == Status.pending || user.friendStatus == Status.requsted})">
          <div class="pending">Pending FriendRequests</div>
          <div v-for="user in $store.state.friendsList">
            <UserSummary
              v-if="user.friendStatus == Status.pending || user.friendStatus == Status.requsted"
              :user = user as User ></UserSummary>
          </div>
          <div class="pending">Friends</div>
        </div>
        <div v-for="user in $store.state.friendsList">
          <UserSummary
          v-if="user?.friendStatus != Status.pending && user.friendStatus != Status.requsted"
          :user = user as User ></UserSummary>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import UserSummary from '@/components/Profile/UserSummary.vue';
import User from '@/models/user';
import { defineComponent } from 'vue';
import { Status } from '@/enums/models/ResponseEnum';

export default defineComponent({
  data() {
    return {
      isCollapsed: true as boolean,
      Status: Status,
    }
  },
  methods: {
    toggleFriendList(): void {
      this.$store.state.NrFriendRequests = 0;
      this.isCollapsed = !this.isCollapsed;
    },
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
    top: -62px;
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
    animation: growUp 350ms ease-in-out forwards;
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

  .notificationCount {
    position: absolute;
    left: -10px;
    top: -10px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    font-size: 20px;
    color: var(--ft_dark);
    background-color: var(--ft_pink);
    border: 1px solid var(--ft_pink);
  }
  .friends {
    overflow-y: auto;
    margin-top: -2px;
    height: calc(600px - 64px);
  }
  
  @keyframes growUp {
    0% {
      transform: scaleY(0);
    }
    70% {
      transform: scaleY(1.2);
    }
    100% {
      transform: scaleY(1);
    }
  }

  .pending {
    font-size: 20px;
    font-weight: bold;
  }
  .text {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .countBubble {
    color: var(--ft_dark);
    background-color: var(--ft_cyan);
    border-radius: 50%;
    font-size: 25px;
    height: 30px;
    width: 30px;
    margin-left: 10px;
  }

</style>