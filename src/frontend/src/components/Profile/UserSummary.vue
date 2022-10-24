<template>
  <div class="userSummary">
    <div class="normalView">
      <img :src="user?.avatar_url" alt="Avatar">
      <span>{{ user?.username }}</span>
      <div v-if="user?.status == 0 && user?.me  == 0">
        <button @click="acceptFriend"> accept  </button>
        <button @click="denideFriend"> deny </button>
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
        @click="viewProfile(user?._id)" >
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
        class="dropdownElement"
        @click="askForMatch">
        <font-awesome-icon icon="fa-solid fa-table-tennis-paddle-ball" />
      </button>
      <button 
        v-for="button in extraButtons"
        class="dropdownElement"
        @click="customEmit(button.emit)">
        <font-awesome-icon :icon="button.icon"/>
      </button>
    </div>
  </div>
</template>

<script lang="ts">

import VueAxios from 'axios';
import User from '@/models/user'
import { API_URL } from '@/defines';
import { defineComponent } from 'vue';
import { RequestEnum } from '@/enums/models/RequestEnum';
import { Status } from '@/enums/models/ResponseEnum';

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
      type: Object,
      default: null
    },
    extraButtons: {
      type: Array,
      default: []
    },
  },
  mounted() {
    console.log(this.user)
  },
  methods: {
    customEmit(emitMsg){
      this.$emit('action', emitMsg, this.user._id)
    },
    addFriend(): void {
      this.$store.state.socket.emit('Request', {id: this.user._id, type: RequestEnum.FRIENDSHIP})
    },
    acceptFriend(){
      this.$store.state.socket.emit('Response', {id: this.user._id, status: Status.accepted})
      console.log("Accepting FreindRequest", this.user._id)
    },
    denideFriend(){
      this.$store.state.socket.emit('Response', {id: this.user._id, status: Status.denide})
      console.log("Accepting FreindRequest", this.user._id)
    },
    removeFriend(){
      this.$store.state.socket.emit('Remove', {id: this.user._id})
    },
    hideOnClick(e) {
      if (!this.$el.contains(e.target)){
        this.show = false;
      }
    },
    viewProfile(id: number){
      this.show = false;
      this.$router.push('/profile/' + id.toString());
    },
    toggleDropdown() {
      console.log("toggleDropdown");
      this.show = !this.show
    },
    askForMatch(){
      this.$store.state.socketGame.emit('Request', {id: this.user._id}, (r) => {
        this.$router.push('/play/' + r.toString())
      })
      console.log("AskForMatch");
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
    /* width: 17%; */
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