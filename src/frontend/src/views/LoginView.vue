<template>
  <div>
    <a href='http://localhost:3000/auth/login'>login</a>
    <!-- <button @click=authenticateFT>Auth</button> -->
    <br/>
  </div>
</template>

<script lang ="ts">
  import { Vue } from 'vue-class-component';
  import VueAxios from 'axios';



  export default class LoginView extends Vue {
    jwt: any = '404'
    authenticateFT(): void {
      VueAxios
        .get('http://localhost:3000/auth/login')
        .then(response => (this.jwt = response))
      console.log(this.jwt)
    }
  }
</script>