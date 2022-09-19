<template>
  <div>
    <h1 v-if="!this.$store.getters.isLogged">Please login</h1>
    <h1 v-else>Already logged in</h1>
  </div>
</template>

<script lang ="ts">
  import { Vue } from 'vue-class-component';

  export default class LoginView extends Vue {
  }
</script>