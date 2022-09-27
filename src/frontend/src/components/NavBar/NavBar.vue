<template>
  <div class="topBar">
    <div 
      v-if=isLoggedIn
      class="currentUser"
      :class="{'userActive': this.$route.name === 'me'}"
      @click="this.$router.push('/')"
    >
      <img :src="this.$store.getters.getUser.avatar_url" class="userPic">
      <span class="userName">{{ this.$store.getters.getUser.unique_name }} </span>
    </div>
    <div v-else>
    </div>
    <router-link :to="'/chat'" class="navButton">chat</router-link>
    <router-link :to="'/play'" class="playButton">PLAY</router-link>
    <router-link :to="'/settings'" class="navButton">settings</router-link>
    <FtAuth/>
  </div>
</template>

<script lang="ts">
  import FtAuth from '../Auth/FtAuth.vue';
  import store from '@/store/index';

  export default {
    data() {
      return {
        sites: [
          {
            label: 'Chats',
            link: '/chat',
            type: 'left'
          },
          {
            label: 'Settings',
            link: '/settings',
            type: 'right'
          }
        ]
      } 
    },
    computed: {
      isLoggedIn: {
        get(): boolean {
          return store.state.validated;
        }
      }
    },
    components: {
      FtAuth,
    }
  }
</script>

<style>

.topBar {
  display: flex;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(#550055, #000055);
  border-bottom: 5px solid var(--ft_white);
}

.currentUser {
  padding-left: 20px;
  color: var(--ft_pink);
}
.userActive {
  color: var(--ft_blue);
}

.userName {
  padding-left: 10px;
  font-size: 25px;
  font-weight: bold;
  vertical-align: middle;
}

.userPic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  vertical-align: middle;
}

.navButton {
  font-weight: bold;
  color: var(--ft_pink);
  text-decoration: none;
  font-size: 25px;
}

.navButton.router-link-exact-active {
  color: var(--ft_blue);
}

.playButton{
  text-align: center;
  font-size: 35px;
  font-weight: bold;
  color: var(--ft_white);
  background-size: auto;
  background-image: linear-gradient(var(--ft_pink), var(--ft_blue));
}
</style>