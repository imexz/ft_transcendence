<template>
  <div class="wrapper" >
    <button class="searchButton" @click="toggleSearchBar">
      <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
    </button>
    <div v-show="show" class="searchPopUp">
      <div class="headLineWrapper">
        <div class="headLine">Search</div>
        <button class="exitButton" @click="toggleSearchBar">
          <font-awesome-icon icon="fa-solid fa-x" />
        </button>
      </div>
      <input
        type="text"
        class="searchInput"
        placeholder="username"
        v-model="searchQuery"
        ref="searchInput" />
      <div class="searchResults"
        v-if="searchQuery != ''">
        <UserSummary @actions="toggleSearchBar"
          class="searchResult"
          v-for="user in filteredUsers()"
          :user = user />
      </div>
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
      users : [] as User[],
      show: false as boolean,
    }
  },
  methods: {
    filteredUsers() {
      return this.users.filter((user) =>
        user.username.toLowerCase().includes(this.searchQuery.toLocaleLowerCase()))
    },
    hideOnClick(e) {
      if (!this.$el.contains(e.target)){
        this.toggleSearchBar()
      }
    },
    toggleSearchBar() {
      if (!this.$store.state.validated)
        return
      if (this.show) {
        this.searchQuery = ""
        window.removeEventListener('click', this.hideOnClick)
      }
      else {
        this.getData()
        window.addEventListener('click', this.hideOnClick)
      }
      this.show = !this.show
      this.$nextTick(() => {
        this.$refs.searchInput.focus()
      })
    },
    getData() {
      VueAxios({
        url: '/users/allUser',
        baseURL: API_URL,
        method: 'GET',
        withCredentials: true,
      })
        .then(response => { this.users = response.data })
        .catch(e => { this.dispatch('triggerToast', {mode: 'error', show: true, msg: 'Could not load Data'})})
    }
  },
  mounted() {
    this.getData()
  }
})

</script>

<style scoped>

  .searchButton {
    align-items: center;
    height: 64px;
    width: 64px;
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    font-size: 25px;
    font-weight: bold;
    border: 2px solid var(--ft_cyan);
    border-radius: 10px;
  }

  .searchButton:hover {
    background-color: var(--ft_cyan);
    color: var(--ft_dark);
  }

  .searchPopUp {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 120px;
    border: 2px solid var(--ft_cyan);
    width: 440px;
    height: 600px;
    background-color: var(--ft_dark);
    border-radius: 10px;
  }

  .headLineWrapper {
    margin-top: 15px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    padding-left: 22px;
    padding-right: 22px;
    border-bottom: 1px solid var(--ft_cyan);
    display: flex;
    justify-content: space-between;
  }

  .headLine {
    font-size: 25px;
    font-weight: bold;
  }

  .exitButton {
    height: 30px;
    width: 30px;
    font-weight: bold;
    padding: 3px;
    border-radius: 50%;
    border: 2px solid var(--ft_pink);
    color: var(--ft_pink);
    background-color: var(--ft_dark);
  }
  .exitButton:hover {
    color: var(--ft_dark);
    background-color: var(--ft_pink);
  }

  .searchInput {
    height: 60px;
    width: 380px;
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    font-size: 25px;
    font-weight: bold;
    border: 1px solid var(--ft_cyan);
    padding: 0px 10px 0px 10px;
  }

  .searchResults{
    display: inline-block;
    height: calc(600px - 60px - 20px - 18px - 18px - 60px);
    width: 404px;
    margin-top: 18px;
    border: 1px solid var(--ft_cyan);
    overflow-y: auto;
    background-color: var(--ft_dark);
    animation: slideDown 200ms ease-in-out forwards;
    transform-origin: top center;
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
