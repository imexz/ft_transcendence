<template>
  <div>
    <button @click="authenticate">42 AUTH</button>
    <button @click="validateUser">validate AUTH</button>
    <EnableTwoFA/>

  </div>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import VueAxios from 'axios';
  import { hostURL } from '@/models/host';
import EnableTwoFA from './enable2fc.vue';
import Enable2fc from './enable2fc.vue';

  @Options ({
    components: {
      EnableTwoFA,
    }
  })

  export default class FtAuth extends Vue {
  authenticate() {
    location.href=hostURL + ':3000/auth/login'
  }

  validateUser() {
      VueAxios({
        url: '/users/validate',
        baseURL: hostURL + ':3000',
        method: 'GET',
        withCredentials: true,
      })
      .then(response => (
        // console.log(response)
        
        this.$store.state.validated = true,
        this.$store.state.user = response.data,
        this.$socketio.auth.token = response.data.user_id))
      .catch(error => (
        // console.log(error.code)
          // console.log(error)
          
          
          // error.response.data.statusCode

          
          this.$store.state.validated = false
        ))
    }

    

    mounted() {
      // this.validateUser()
    }
  }
</script>