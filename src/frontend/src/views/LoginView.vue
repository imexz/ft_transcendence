<template>
  <div>
    <a href='http://localhost:3000/auth/login'>42 AUTH</a>
  </div>
</template>

<script lang ="ts">
  import { Vue } from 'vue-class-component';
  import VueAxios from 'axios';
  //import User from '../models/User';

  export default class LoginView extends Vue {
    checkTokenCookie(): boolean {
      let cookies : string[] = document.cookie.split(" ")
      for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].split("=")[0] == "token") {
          return true
        }
      }
      return false
    }
    async validateUser(): Promise<boolean> {
      let status: number = 401
      await VueAxios
        .get('http://localhost:3000/auth/protected', { withCredentials: true})
        .then(response => (status = response.status))
        .catch(error => (status = error.response.status))
      if (status == 401) {
        return false;
      }
      return true;
    }

    async mounted() {
      if (this.checkTokenCookie()) {
        let state :boolean = await this.validateUser()
        if (state) {
          this.$router.push("/Profile")
        }
      }
    }
  }
</script>