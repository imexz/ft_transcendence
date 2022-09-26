<template>
  <button @click="logout">logout</button>
</template>

<script lang="ts">

  import { Vue } from 'vue-class-component';
  import VueAxios from 'axios';
  import { API_URL } from '@/models/host';


  export default class LogoutButton extends Vue {
    logout(): void {
      // document.cookie = "Authentication=; expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax"
      this.$store.state.validated = false;
      this.$store.state.user = null;
      this.$router.push("/login")

      VueAxios({
          url: '/users/logout',
          baseURL: API_URL,
          method: 'GET',
          withCredentials: true,
        })
    }
  }
</script>