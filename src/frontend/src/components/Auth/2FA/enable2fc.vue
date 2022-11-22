<template>
  <div>
    <div class="btns">
      <div>
        <button @click="on">turn-on</button>
        <button @click="off">turn-off</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return{
      QR : API_URL + '/twofa/generate',
      twoFactorAuthenticationCode: '',
    } 
  },
  methods: {
    authenticate() {
        VueAxios({
            url: '/twofa/authenticate',
            baseURL: API_URL,
            method: 'POST',
            withCredentials: true,
            data : { 'twoFactorAuthenticationCode': this.twoFactorAuthenticationCode}
        })
          .then(r => this.triggerToast("Authenticated", "success"))
          .catch(e => this.triggerToast(e.response, "error"))
    },
    on() {
        VueAxios({
            url: '/users/turn-on',
            baseURL: API_URL,
            method: 'POST',
            withCredentials: true,
            data : { 'twoFactorAuthenticationCode': this.twoFactorAuthenticationCode}
        })
        .then(r => this.triggerToast("2FA activated", "success"))
          .catch(e => this.triggerToast(e.response, "error"))
    },
    off() {
        VueAxios({
            url: '/users/turn-off',
            baseURL: API_URL,
            method: 'GET',
            withCredentials: true,
        })
        .then(r => this.triggerToast("2FA disabled", "success"))
        .catch(e => this.triggerToast(e.response, "error"))
    },
    triggerToast(msg: string, mode: string) {
      this.$store.dispatch('triggerToast', {show: true, msg: msg, mode: mode})
    }
  }
})

</script>

<style scoped>
  .btns{
    display: flex;
    justify-content: space-between;
  }
</style>