<template>
  <div>
    <div v-if="$store.state.user == null">
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
import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    async logout() {
      await VueAxios({
          url: '/auth/logout',
          baseURL: API_URL,
          method: 'GET',
          withCredentials: true,
      })
      this.$store.dispatch('logOut');
      this.$router.push('/login');
    },
    authenticate() {
      location.href= API_URL + '/auth/login'
    },
    triggerToast(msg: string, mode: string) {
      this.$store.dispatch('triggerToast', {show: true, msg: msg, mode: mode})
    },
  },
  mounted(): void {
    this.$store.dispatch('validateUser')
    .then(ret => {
      if (ret) { 
        this.triggerToast('vaildated', 'success')
      } else {
        this.triggerToast('please log in', 'error')
      }
    }
    )
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