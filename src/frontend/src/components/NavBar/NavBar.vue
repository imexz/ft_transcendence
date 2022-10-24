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
          {{ $store.getters.getUser.username }}
        </span>
      </div>
      <div v-else></div>
    </div>
    <div class="child topElement">
      <router-link :to="'/play'" class="playButton">PLAY</router-link>
    </div>
    <div class="rightSide child">      
      <div class="sb rightSideElement">
        <SearchBar></SearchBar>
      </div>
      <div class="topElement rightSideElement">
        <router-link :to="'/chat'" class="navButton">
          <font-awesome-icon icon="fa-solid fa-message" />
          <div v-if="$store.state.NrMessages" class="notificationCount">
            {{ $store.state.NrMessages }}
          </div>
        </router-link>
      </div>
      <div class="topElement rightSideElement">
        <router-link :to="'/settings'" class="navButton ">
          <font-awesome-icon icon="fa-solid fa-gear" />
        </router-link>
      </div>
      <div>
        <FtAuth/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import FtAuth from '../Auth/FtAuth.vue';
import store from '@/store/index';
import { defineComponent } from 'vue';
import SearchBar from '@/components/NavBar/SearchBar.vue';

export default defineComponent({
  computed: {
    isLoggedIn(): boolean {
        return store.state.validated;
    },
  },
  components: {
    FtAuth,
    SearchBar,
  }
})

</script>

<style>

.topBar {
  --dark: var(--ft_dark);
  --cold: var(--ft_cyan);
  --hot: var(--ft_pink);
  position: sticky;
  top: 0px;
  z-index: 11;
  display: flex;
  flex-wrap: nowrap;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  background: var(--dark);
  border-bottom: 2px solid var(--hot);
  margin-bottom: 20px;
}
.topElement:active {
  transform: translateY(1px);
  
}

/* .sb {
  flex-basis: 20%;
} */

.child {
  flex-basis: 33%;
}

.currentUser {
  cursor: default;
  float: left;
  align-items: center;
  padding: 1px 20px;
  vertical-align: middle;
  border: 2px solid var(--c);
  border-radius: 10px;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
  --c : var(--cold);
}
.currentUser:hover {
  --c : var(--dark);
  background-color: var(--cold);
}
.userActive {
  --c : var(--hot);
}
.userActive:hover {
  --c : var(--dark);
  background-color: var(--hot);
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

.rightSide {
  display: flex;
  justify-content: flex-end; 
}

.rightSideElement {
  margin-right: 15px;
}

.navButton {
  position: relative;
  cursor: default;
  font-weight: bold;
  color: var(--cold);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  height: 60px;
  width: 60px;
  font-size: 25px;
  align-self: flex-start;
  /* padding: 10px 20px; */
  border: 2px solid var(--cold);
  border-radius: 10px;
}

.navButton.router-link-exact-active {
  color: var(--hot);
  border: 2px solid var(--hot);
}

.navButton:hover {
  color: var(--dark);
  background-color: var(--cold);
}
.navButton.router-link-exact-active:hover {
  color: var(--dark);
  background-color: var(--hot);
}

.playButton{
  cursor: default;
  text-decoration: none;
  text-align: center;
  font-size: 25px;
  font-weight: bold;
  color: var(--ft_white);
  background:  linear-gradient(var(--hot), var(--ft_yellow));
  padding: 14px 24px;
  border-radius: 10px;
}

.notificationCount {
    position: absolute;
    left: -10px;
    top: -10px;
    width: 25px;
    height: 25px;
    padding: auto;
    border-radius: 50%;
    font-size: 20px;
    color: var(--ft_dark);
    background-color: var(--ft_pink);
    border: 1px solid var(--ft_pink);
  }
</style>