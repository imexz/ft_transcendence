<template>
  <div>
    <img :src='user.avatar_url' alt='Profile Pic'>
    <h1>Welcome {{ user.unique_name }}</h1>
  </div>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import User from '@/models/user';
  import { hostURL } from '@/models/host';
  import VueAxios from 'axios';

  @Options ({
    props: {
      pid: Number
    }
  })

  export default class Profile extends Vue {
    pid!: number
    user!: User

    created(): void {
        if (this.pid == (this.$store.getters.getUser as User).id || this.pid == 0){
         this.user = (this.$store.getters.getUser as User)
        }
        else{
          VueAxios({
            url: '/users/find/' + this.pid.toString(),
            baseURL: hostURL + ':3000',
            method: 'GET',
            withCredentials: true,
          })
            .then(response => { this.user = response.data })
            .catch()
        }
    }
    updated(){
      if (this.pid == (this.$store.getters.getUser as User).id || this.pid == 0){
        this.user = (this.$store.getters.getUser as User)
      }
      else{
        VueAxios({
          url: '/users/find/' + this.pid.toString(),
          baseURL: hostURL + ':3000',
          method: 'GET',
          withCredentials: true,
        })
        .then(response => { this.user = response.data })
        .catch()
      }
    }
  }

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