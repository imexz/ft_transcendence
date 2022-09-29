<template>
  <div v-if="this.user">
    <img :src='this.user.avatar_url' alt='Profile Pic'>
    <h1>Welcome {{ this.user.unique_name }}</h1>
  </div>
</template>

<script lang="ts">
import User from '@/models/user';
import { API_URL } from '@/defines';
import VueAxios from 'axios';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      user: null as User | null,
    }
  },
  props: {
    id: {
      type: String,
      default: "0" },
  },
  methods: {
    fetchUser(): void {
      if (this.id == '0') {
        this.user =this.$store.getters.getUser;
      }
      else {
      VueAxios({
          url: '/users/find/' + this.id,
          baseURL: API_URL,
          method: 'GET',
          withCredentials: true,
        })
          .then(response => { this.user = response.data })
          .catch()
      }
    }
  },
  mounted() {
    this.fetchUser();
  },
  updated() {
    if (this.user && ( parseInt(this.id) != this.user.id) )
      this.fetchUser();
  }
})

</script>

<style scoped>
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