<template>
  <div>
    <img :src="user.avatar_url" alt="Avatar">
    <span>{{ user.unique_name }}</span>
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import User from '../models/user';

  @Options ({
    props : {
      user: User
    }
  })

  export default class UserSummary extends Vue {
  }
</script>

<style scoped>
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
    padding: 50px;
    font-size: 30px;
  }
  div {
    border: 5px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(var(--ft_pink), var(--ft_blue));
  }
</style>