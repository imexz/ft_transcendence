<template>
  <div>
    <img :src="user.avatar_url" alt="Avatar">
    <span>{{ user.unique_name }}</span>
    <button @click="addFriend" >AddFriend</button>
    <button>View Profile</button>
    <button>Send Dm</button>
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import VueAxios from 'axios';
<<<<<<< HEAD
  import User from '../models/user';
=======
  import User from '../models/user'
>>>>>>> 4c8485dfcaa8d95cc1cbdd6b9d00f5984b0f01e2

  @Options ({
    props : {
      user: Object
    }
  })

  export default class UserSummary extends Vue {
    user!: User;
    addFriend(): void {
      user:! User;
      VueAxios({
        url: '/users/addFriend',
        baseURL: 'http://localhost:3000',
        method: 'POST',
        withCredentials: true,
        data: {"id" : this.user.id},
      })
        .then()
        .catch()
    }
  }
</script>

<style scoped>
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    vertical-align: middle;
    padding: 10px;
    display: inline-block;
  }
  span {
    vertical-align: middle;
    /* padding: 50px; */
    display: inline-block;
    font-size: 30px;
    width: 200px;
  }
  div {
    text-align: left;
    border: 5px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(var(--ft_pink), var(--ft_blue));
  }
  button {
    vertical-align: middle;
  }
</style>