<template>
  <div>
    <img :src="this.user.avatar_url" alt="Avatar">
    <span>{{ this.user.unique_name }}</span>
    <button @click="addFriend" >AddFriend</button>
    <button @click="viewProfile(this.user.id)">View Profile</button>
    <button>Send Dm</button>
  </div>
</template>

<script lang="ts">

import VueAxios from 'axios';
import User from '@/models/user'
import { API_URL } from '@/defines';
import { defineComponent } from 'vue';

export default defineComponent({
  props : {
    user: {
    type: Object,
    }
  },
  methods: {
    addFriend(): void {
      VueAxios({
        url: '/users/addFriend',
        baseURL: API_URL,
        method: 'POST',
        withCredentials: true,
        data: {"id" : this.user?.id},
      })
        .then()
        .catch()
    },
    viewProfile(id: number){
      this.$router.push('/profile/' + id.toString());
    }
  },
})

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