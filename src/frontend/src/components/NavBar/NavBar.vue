<template>
  <div class="topBar">
    <div class="child">
      <div 
        v-if=isLoggedIn
        class="currentUser topElement"
        :class="{'userActive': $route.name === 'me'}"
        @click="$router.push('/')">
        <img :src="$store.getters.getUser.avatar_url" class="userPic">
        <span class="userName">
          {{ $store.getters.getUser.unique_name }}
        </span>
      </div>
      <div v-else></div>
    </div>
    <div class="child topElement">
      <router-link :to="'/chat'" class="navButton" >chat</router-link>
    </div>
    <div class="child topElement">
      <router-link :to="'/play'" class="playButton">PLAY</router-link>
    </div>
    <div class="child topElement">
      <router-link :to="'/settings'" class="navButton ">settings</router-link>
    </div>
    <div class="child">
      <FtAuth/>
    </div>
  </div>
</template>

<script lang="ts">

import FtAuth from '../Auth/FtAuth.vue';
import store from '@/store/index';
import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    isLoggedIn(): boolean {
        return store.state.validated;
    },
  },
  components: {
    FtAuth,
  }
})

</script>

<style>

.topBar {
  display: flex;
  flex-wrap: nowrap;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  background: var(--ft_dark);
  border-bottom: 2px solid var(--ft_red);
}
.topElement:active {
  transform: translateY(1px);
}

/* .child {
  flex: 1 0 20%;
} */

.currentUser {
  cursor: default;
  float: left;
  align-items: center;
  padding: 1px 20px;
  vertical-align: middle;
  border: 2px solid var(--c);
  border-radius: 10px;
  --c : var(--ft_cyan);
}
.currentUser:hover {
  --c : var(--ft_dark);
  background-color: var(--ft_cyan);
}
.userActive {
  --c : var(--ft_red);
}
.userActive:hover {
  --c : var(--ft_dark);
  background-color: var(--ft_red);
}

.userName {
  color: var(--c);
  padding-left: 10px;
  font-size: 25px;
  font-weight: bold;
  vertical-align: middle;
  overflow-wrap: break-word;
}
.userPic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid var(--c);
  object-fit: cover;
  vertical-align: middle;
}

.navButton {
  cursor: default;
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
  cursor: default;
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