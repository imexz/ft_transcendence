<template>
  <img src='this.$store.getters.user.avatar_url' alt='Profile Pic'>
  <MatchHistory></MatchHistory>
</template>

<script lang="ts">

  import { Vue } from 'vue-class-component';

  export default class ProileView extends Vue {}

</script>
