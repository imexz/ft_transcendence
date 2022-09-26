<template>
  <div>
    <div v-if="!this.$store.getters.isLogged">
      <button 
        class="authButton"
        @click="authenticate">42 AUTH</button>
        <button @click="validateUser">validate AUTH</button>
        <EnableTwoFA/>
    </div>
    <div v-else>
      <button
        class="authButton"
        @click="logout">Logout</button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import VueAxios from 'axios';
  import { API_URL } from '@/models/host';
  import EnableTwoFA from '@/components/Auth/enable2fc.vue';

  @Options ({
    components: {
      EnableTwoFA,
    }
  })

  export default class FtAuth extends Vue {
  logout(): void {
      this.$store.dispatch('logOut');
      this.$router.push('/login');
  }
  authenticate() {
    location.href= API_URL + '/auth/login'
  }
  validateUser() {
      VueAxios({
        url: '/users/validate',
        baseURL: API_URL,
        method: 'GET',
        withCredentials: true,
      })
      .then(response => (
        console.log(response.data),
        this.$store.dispatch('logIn', response.data)))
      .catch(error => (console.log(error), this.$store.commit('logOut')))
    }
  mounted(): void {
    this.validateUser()
  }
  }
</script>

<style>
  .authButton{
    float: right;
  }
</style>