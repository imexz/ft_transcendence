<template>
  <div class="searchBar">
    <h1> Search </h1>
    <input 
      type="text"
      class="searchInput"
      v-model="searchQuery" />
    <div>
      <UserSummary
        class="serachResult"
        v-if="searchQuery != ''"
        v-for="user in filteredUsers()"
        :user = user />
    </div>
  </div>
</template>

<script lang="ts">


import User from '@/models/user';
import UserSummary from './UserSummary.vue';
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
    }
  },
  methods: {
    filteredUsers() {
      return this.users.filter((user) => 
        user.unique_name.toLowerCase().includes(this.searchQuery.toLocaleLowerCase()))
    }
  },
  mounted() {
    VueAxios({
      url: '/users/allUser',
      baseURL: API_URL,
      method: 'GET',
      withCredentials: true,
    })
      .then(response => { this.users = response.data })
      .catch()
  }
})

</script>

<style scoped>
  .searchBar {
    width: 320px;
    margin-right: 80px;
  }
  .searchInput {
    align-self: right;
    height: 60px;
    width: 296px;
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    font-size: 25px;
    font-weight: bold;
    padding: 0px 10px 0px 10px;
    border: 2px solid;
    border-image: linear-gradient(var(--ft_red), var(--ft_yellow)) 1;
    margin-bottom: 20px;
  }
  .searchResult {
    margin-left: 30px;
  }
</style>