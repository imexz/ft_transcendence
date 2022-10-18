<template>
  <div>
    <Toast v-if="showToast" :msg=toastMsg :mode=toastMode />
    <div v-if="!$store.getters.isLogged">
      <button 
        class="authButton"
        :class="{'linkActive': $route.name === 'login'}"
        @click="authenticate">login</button>
        
    </div>
    <div v-else>
      <button
        class="authButton"
        :class="{'linkActive': $route.name === 'login'}"
        @click="logout">logout</button>
    </div>
  </div>
</template>

<script lang="ts">

import VueAxios from 'axios';
import { API_URL } from '@/defines';
import EnableTwoFA from '@/components/Auth/2FA/enable2fc.vue';
import Toast from '@/components/Toast.vue'
import { ref }  from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    EnableTwoFA,
    Toast,
  },
  data() {
    return {
      showToast : ref(false),
      toastMsg : ref(''),
      toastMode : ref(''),
    }
  },
  methods: {
    logout(): void {
        this.$store.dispatch('logOut');
        this.$router.push('/login');
        VueAxios({
            url: '/auth/logout',
            baseURL: API_URL,
            method: 'GET',
            withCredentials: true,
        })
    },
    authenticate() {
      location.href= API_URL + '/auth/login'
    },
    triggerToast(msg: string, mode: string) {
        this.showToast = true;
        this.toastMsg = msg;
        this.toastMode = mode;
        setTimeout(() => this.showToast = false, 2000);
    },
    validateUser() {
        VueAxios({
          url: '/users/validate',
          baseURL: API_URL,
          method: 'GET',
          withCredentials: true,
        })
        .then(response => (
          this.$store.dispatch('logIn', response.data),
          this.triggerToast('vaildated', 'success')))
        .catch(error => (
          console.log(error),
          this.$store.dispatch('logOut'),
          this.triggerToast('please log in', 'error')))
    }
  },
  mounted(): void {
    this.validateUser()
  }
})

</script>

<style>
  
  .authButton {
    --hot: var(--ft_pink);
    --cold: var(--ft_cyan);
    --dark: var(--ft_dark);
    float: right;
    text-decoration: none;
    text-align: center;
    font-weight: bold;
    font-size: 25px;
    padding: 14px 24px;
    color: var(--cold);
    border: 2px solid var(--cold);
    background-color: rgba(0, 0, 0, 0);
    border-radius: 10px;
  }
  .linkActive {
    color: var(--hot);
    border-color: var(--ft_hot);
  }
  .authButton:hover {    
    color: var(--dark);
    background-color: var(--cold);
  }
  .linkActive:hover {
    color: var(--dark);
    background-color: var(--hot);
  }
  .authButton:active{
    transform: translateY(1px);
  }
</style>