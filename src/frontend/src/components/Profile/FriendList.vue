<template>
    <div>
      <h1> Friends </h1>
        <UserSummary
        v-for="user in users"
        :user = user></UserSummary>
    </div>
</template>

<script lang="ts">
import UserSummary from '@/components/Profile/UserSummary.vue';
import VueAxios from 'axios';
import { API_URL } from '@/models/host';

export default {
  data() {
    return {
      users : [],
    }
  },
  mounted() {
    VueAxios({
      url: '/users/friends',
      baseURL: API_URL,
      method: 'GET',
      withCredentials: true,
    })
      .then(response => { this.users = response.data })
      .catch()
  },
  components: {
    UserSummary,
  }
}
</script>