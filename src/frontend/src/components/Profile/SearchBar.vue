<template>
  <div>
    <input 
      type="text"
      v-model="searchQuery" />
    <div>
      <UserSummary
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