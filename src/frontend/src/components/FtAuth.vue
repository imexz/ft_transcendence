<template>
  <div>
    <button @click="authenticate">42 AUTH</button>
  </div>
</template>

<script lang="ts">
  import { Vue } from 'vue-class-component';
  import VueAxios from 'axios';
  import { hostURL } from '@/models/host';

  export default class FtAuth extends Vue {
  authenticate() {
    location.href=hostURL + ':3000/auth/login'
  }
  validateUser() {
      VueAxios({
        url: '/users/validate',
        baseURL: hostURL + ':3000',
        method: 'GET',
        withCredentials: true,
      })
      .then(response => (
        this.$store.state.validated = true,
        this.$store.state.user = response.data))
      .catch(error => (this.$store.state.validated = false))
    }
  mounted() {
    this.validateUser()
  }
  }
</script>