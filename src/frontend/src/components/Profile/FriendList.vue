<template>
  <div class="friendList">
    <h1> Friends </h1>
    <UserSummary
      v-for="user in users"
      :user = user as User ></UserSummary>
  </div>
</template>

<script lang="ts">
import UserSummary from '@/components/Profile/UserSummary.vue';
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { defineComponent } from 'vue';
import User from '@/models/user'

export default defineComponent({
  data() {
    return {
      users : [] as User[],
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
})

</script>

<style scoped>
  .friendList {
    width: 400px;
    display: flex;
    flex-direction: column;
  }
</style>