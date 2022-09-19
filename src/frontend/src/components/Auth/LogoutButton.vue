<template>
  <button @click="logout">logout</button>
</template>

<script lang="ts">

  import { Vue } from 'vue-class-component';

  export default class LogoutButton extends Vue {
    logout(): void {
      this.$store.dispatch('logOut');
    }
  }
</script>