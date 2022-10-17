<template>
  <div class="userSummary">
    <div class="normalView">
      <img :src="user?.avatar_url" alt="Avatar">
      <div>
      <span>{{ user?.username }}</span>
      <!-- dis is fukking up the allignment -->
      <!-- <h6> {{user?.status}} </h6> -->
      </div>
      <div class="toggleDropdown" @click="toggleDropdown">
        <font-awesome-icon icon="fa-solid fa-bars" />
      </div>
    </div>
    <div class="dropdownMenu" v-if="show">
      <button 
        v-if="$store.getters.getFriends != '' && $store.getters.getFriends.some((us: User) => us._id == user._id)"
        class="dropdownElement"
        @click="removeFriend">
        <font-awesome-icon icon="fa-solid fa-user-minus" />
      </button>
      <button 
        v-else
        class="dropdownElement"
        @click="addFriend">
        <font-awesome-icon icon="fa-solid fa-user-plus" />
      </button>
      <button 
        class="dropdownElement"
        @click="viewProfile(user?._id)">
        <font-awesome-icon icon="fa-solid fa-eye" />
      </button>
      <button
        class="dropdownElement">
        <font-awesome-icon icon="fa-solid fa-message" />
      </button>
      <button
        class="dropdownElement">
        <font-awesome-icon icon="fa-solid fa-ban" />
      </button>
      <button
        class="dropdownElement">
        <font-awesome-icon icon="fa-solid fa-table-tennis-paddle-ball" />
      </button>
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
  created() {
    window.addEventListener('click', this.hideOnClick)  
  },
  unmounted() {
    window.removeEventListener('click', this.hideOnClick)
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
    hideOnClick(e) {
      if (!this.$el.contains(e.target)){
        this.show = false;
      }
    },
    removeFriend(){
      // console.log("IMPLEMENT API TO REMOVE FRIEND")
     
      VueAxios({
        url: '/users/removeFriend',
        baseURL: API_URL,
        method: 'POST',
        withCredentials: true,
        data: {"id" : this.user?._id},
      })
        .then(this.$store.commit('removeFriend', this.user._id))
        .catch()
      // this.$store.commit('removeFriend', this.user._id);
    },
    viewProfile(id: number){
      this.show = false;
      this.$router.push('/profile/' + id.toString());
    },
    toggleDropdown() {
      console.log("toggleDropdown");
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
    min-width: 253px;
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
    display: flex;
    width: 100%;
    justify-content: space-between;
    position: absolute;
    border: 2px solid;
    background-color: var(--ft_dark);
    border-image: linear-gradient(90deg, var(--ft_cyan), var(--ft_pink)) 1;
    top: 64px;
    left: -2px;
    z-index: 1;
  }
  .dropdownElement {
    width: 17%;
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
    margin: 3px;
  }
  .toggleDropdown {
    padding: 10px;
    align-items: center;
    display: flex;
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