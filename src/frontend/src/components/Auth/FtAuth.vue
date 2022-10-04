<template>
  <div>
    <Toast v-if="showToast" :msg=toastMsg :mode=toastMode />
    <div v-if="!this.$store.getters.isLogged">
      <button 
        class="authButton"
        :class="{'linkActive': this.$route.name === 'login'}"
        @click="this.authenticate">login</button>
        
    </div>
    <div v-else>
      <button
        class="authButton"
        :class="{'linkActive': this.$route.name === 'login'}"
        @click="this.logout">logout</button>
    </div>
  </div>
</template>

<script lang="ts">

import VueAxios from 'axios';
import { API_URL } from '@/defines';
import EnableTwoFA from '@/components/Auth/enable2fc.vue';
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
            url: '/users/logout',
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
          this.$store.commit('logOut'),
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
    float: right;
    text-decoration: none;
    text-align: center;
    font-weight: bold;
    font-size: 25px;
    padding: 14px 24px;
    color: var(--ft_cyan);
    border: 2px solid var(--ft_cyan);
    background-color: rgba(0, 0, 0, 0);
    border-radius: 10px;
  }
  .linkActive {
    color: var(--ft_red);
    border-color: var(--ft_red);
  }
  .authButton:hover {    
    color: var(--ft_dark);
    background-color: var(--ft_cyan);
  }
  .linkActive:hover {
    color: var(--ft_dark);
    background-color: var(--ft_red);
  }
  .authButton:active{
    transform: translateY(1px);
  }
</style>