<template>
  <div class="userSummary">
    <div class="normalView">
      <img :src="user?.avatar_url" alt="Avatar">
      <span>{{ user?.username }}</span>
      <div class="toggleDropdown" @click="toggleDropdown">:</div>
    </div>
    <div class="dropdownMenu" v-if="show">
      <button 
        v-if="$store.getters.getFriends.some((us: User) => us._id == user._id)"
        class="dropdownElement"
        @click="removeFriend">Remove Friend</button>
      <button 
        v-else
        class="dropdownElement"
        @click="addFriend">AddFriend</button>
      <button 
        class="dropdownElement"
        @click="viewProfile(user?._id)">View Profile</button>
      <button
        class="dropdownElement">Send Dm</button>
      <button
        class="dropdownElement">Block</button>
<button
        class="dropdownElement">Challenge to Match</button>
    </div>
  </div>
</template>

<script lang="ts">

import VueAxios from 'axios';
import User from '@/models/user'
import { API_URL } from '@/defines';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      show: false as boolean,
    }
  },
  props : {
    user: {
      type: User,
      default: null
    }
  },
  methods: {
    addFriend(): void {
      VueAxios({
        url: '/users/addFriend',
        baseURL: API_URL,
        method: 'POST',
        withCredentials: true,
        data: {"id" : this.user?._id},
      })
        .then(this.$store.commit('addFriend', this.user))
        .catch()
    },
    removeFriend(){
      console.log("IMPLEMENT API TO REMOVE FRIEND")
      this.$store.commit('removeFriend', this.user._id);
    },
    viewProfile(id: number){
      this.$router.push('/profile/' + id.toString());
    },
    toggleDropdown() {
      this.show = !this.show
    },
  },
})

</script>

<style scoped>
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid var(--ft_cyan);
    object-fit: cover;
  }
  .userSummary {
    position: relative;
    /* width: 316px; */
    border: 2px solid;
    border-image: linear-gradient(90deg, var(--ft_cyan), var(--ft_pink)) 1;
  }
  .normalView {
    padding: 5px;
    font-size: 25px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dropdownMenu {
    display: inline-block;
    position: absolute;
    background-color: var(--ft_pink);
    top: 64px;
    left: -2px;
    z-index: 1;
  }
  .dropdownElement {
    width: 320px;
    font-size: 20px;
    font-weight: bold;
    text-align: end;
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    border: 2px solid var(--ft_pink);
  }
  .toggleDropdown {
    padding-left: 10px;
    padding-right: 10px;
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
  }
  .toggleDropdown:active {
    transform: translateY(1px);
  }

  .toggleDropdown:hover {
    color: var(--ft_dark_purple);
    background-color: var(--ft_cyan);
  }
  .dropdownElement:active {
    transform: translateY(1px);
  }
  .dropdownElement:hover {
    background-color: var(--ft_dark_purple);
    
  }
</style>