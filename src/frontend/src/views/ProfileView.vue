<template>
  <h1>BonJour</h1>
  <button @click="logout">logout</button>
</template>

<script lang="ts">

  import { Vue } from 'vue-class-component';

  export default class ProfileView extends Vue {
    logout(): void {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      this.$router.push("/login")
    }
  }
</script>