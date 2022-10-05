<template>
  <div class="wrapper" @mouseleave="mouseOut">
    <div class="searchBar" :class="{'searchBarActive': isActive}">
      <Transition>
        <div
          v-if="isActive" 
          class="activeSearchBar">
        <input 
          type="text"
          class="searchInput"
          v-model="searchQuery" />
        </div>
      </Transition>
    <button class="searchButton" :class="{'searchButtonPassive': !isActive}" @click="toggleSearchBar">
      <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
    </button>
  </div>
    <div class="searchResults"
      v-if="searchQuery != ''">
      <UserSummary
        class="searchResult"
        v-for="user in filteredUsers()"
        :user = user />
    </div>
  </div>
</template>

<script lang="ts">


import User from '@/models/user';
import UserSummary from '@/components/Profile/UserSummary.vue';
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    UserSummary,
  },
  data() {
    return {
      searchQuery: '' as string,
      active: false as boolean,
      users : [] as User[],
      isActive: false as boolean,
    }
  },
  methods: {
    filteredUsers() {
      return this.users.filter((user) => 
        user.username.toLowerCase().includes(this.searchQuery.toLocaleLowerCase()))
    },
    toggleSearchBar() {
      if (this.isActive)
        this.searchQuery = ""
      else
        this.getData()
      this.isActive = !this.isActive
    },
    mouseOut() {
      if (this.isActive)
        this.toggleSearchBar()
    },
    getData() {
      VueAxios({
        url: '/users/allUser',
        baseURL: API_URL,
        method: 'GET',
        withCredentials: true,
      })
        .then(response => { this.users = response.data })
        .catch()
    }
  },
  mounted() {
    this.getData()
  }
})

</script>

<style scoped>

  .wrapper {
    display: inline-block;
    position: relative;
  }
  .searchBar {
    display: flex;
    border: 2px solid;
    border-color: var(--ft_cyan);
    border-radius: 10px;
    padding: 0px 10px 0px 10px;
  }
  .searchBarActive {
    border-radius: 10px 10px 0px 0px;
    animation: slideOut 200ms ease-in-out forwards;
  }
  .searchButton {
    align-items: center;
    padding: 0px;
    height: 60px;
    width: 60px;
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    font-size: 25px;
    font-weight: bold;
    border: none;
    border-left: 2px solid var(--ft_cyan);
    padding-left: 10px;
  }
  .searchButtonPassive {
    /* border: 2px solid var(--ft_cyan);
    border-radius: 10px; */
    border: none;
    padding: 0px;
  }
  .searchInput {
    align-self: right;
    height: 60px;
    width: 300px;
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    font-size: 25px;
    font-weight: bold;
    border: none;
  }

  .searchResults{
    position: absolute;
    top: 64px;
    height: 400px;
    width: 384px;
    overflow-y: auto;
    background-color: var(--ft_dark);
    border: 2px solid var(--ft_cyan);
    border-radius:  0px 0px 10px 10px;
    animation: slideDown 200ms ease-in-out forwards;
    transform-origin: top center;
  }

  @keyframes slideOut {
    0% {
      transform: scaleX(0%);
    }
    100% {
      transform: scaleX(100%);
    }
  }

  @keyframes slideDown {
    0% {
      transform: scaleY(0%);
    }
    100% {
      transform: scaleY(100%);
    }
  }

</style>