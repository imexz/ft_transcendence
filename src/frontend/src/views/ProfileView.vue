<template>
  <img :src=ProfilePicUrl alt='Profile Pic'>
  <MatchHistory></MatchHistory>
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
  img {
    width: 300px;
    height: auto;
  }
</style>