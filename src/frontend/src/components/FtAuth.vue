<template>
  <div>
    <button @click="authenticate">42 AUTH</button>
  </div>
</template>

<script lang="ts">
  import { Vue } from 'vue-class-component';
  import VueAxios from 'axios';

  export default class FtAuth extends Vue {
  authenticate() {
    location.href='http://localhost:3000/auth/login'
  }
  validateUser() {
      VueAxios
        .get('http://localhost:3000/users/validate', { withCredentials: true})
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