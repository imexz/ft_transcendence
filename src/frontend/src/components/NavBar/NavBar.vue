<template>
  <div class="topBar">
    <div 
      v-if=isLoggedIn
      class="currentUser topElement"
      :class="{'userActive': this.$route.name === 'me'}"
      @click="this.$router.push('/')">
      <img :src="this.$store.getters.getUser.avatar_url" class="userPic">
      <span class="userName">
        {{ this.$store.getters.getUser.unique_name }}
      </span>
    </div>
    <div v-else></div>
    <router-link :to="'/chat'" class="navButton topElement">chat</router-link>
    <router-link :to="'/play'" class="playButton topElement">PLAY</router-link>
    <router-link :to="'/settings'" class="navButton topElement">settings</router-link>
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
      isLoggedIn(): boolean {
          return store.state.validated;
      },
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
  background: var(--ft_dark);
  border-bottom: 2px solid var(--ft_white);
}

.topElement:active {
  transform: translateY(1px);
}

.currentUser {
  /* padding-left: 25px; */
  padding: 1px 20px;
  vertical-align: middle;
  border: 2px solid var(--c);
  border-radius: 10px;
  --c : var(--ft_cyan);

}

.userName {
  color: var(--c);
  padding-left: 10px;
  font-size: 25px;
  font-weight: bold;
  vertical-align: middle;
  overflow-wrap: break-word;
}
.userActive {
  --c : var(--ft_red);
}
.userPic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid white;
  object-fit: cover;
  vertical-align: middle;
}

.navButton {
  font-weight: bold;
  color: var(--ft_cyan);
  text-decoration: none;
  font-size: 25px;
  padding: 10px 20px;
  border: 2px solid var(--ft_cyan);
  border-radius: 10px;
}

.navButton.router-link-exact-active {
  color: var(--ft_red);
  border: 2px solid var(--ft_red);
}

.navButton:hover {
  color: var(--ft_dark);
  background-color: var(--ft_cyan);
}
.navButton.router-link-exact-active:hover {
  color: var(--ft_dark);
  background-color: var(--ft_red);
}

.playButton{
  text-decoration: none;
  text-align: center;
  font-size: 25px;
  font-weight: bold;
  color: var(--ft_white);
  background:  linear-gradient(var(--ft_red), var(--ft_yellow));
  padding: 14px 24px;
  border-radius: 10px;
}
</style>