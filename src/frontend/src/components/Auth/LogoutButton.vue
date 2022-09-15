<template>
  <button @click="logout">logout</button>
</template>

<script lang="ts">

  import { Vue } from 'vue-class-component';

  export default class LogoutButton extends Vue {
    logout(): void {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax"
      this.$store.state.validated = false;
      this.$store.state.user = null;
      this.$router.push("/login")
    }
  }
</script>