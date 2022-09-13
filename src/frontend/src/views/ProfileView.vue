<template>
  <img :src='ProfilePicUrl' alt='Profile Pic'>
  <h1>Welcome {{ this.$store.getters.getUser.unique_name }}</h1>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';

  export default class ProileView extends Vue {
    ProfilePicUrl: string = ""
    mounted() {
      this.ProfilePicUrl = this.$store.getters.getUser.avatar_url;
    }
  }
</script>

<style>
  h1 {
    float: left;
    padding-left: 30px;
  }
  img {
    float: left;
    width: 300px;
    height: auto;
    border: 10px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(var(--ft_pink), var(--ft_blue));
  }
</style>