<template>
  <Toast v-if="showToast" :msg=toastMsg :mode=toastMode />
  <div>
    <div>
        <!-- <button @click="enableTwoFA"> enable two Factor </button> -->
    </div>
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
import { defineComponent, ref } from 'vue';
import Toast from '@/components/Toast.vue'

export default defineComponent({
  data() {
    return{
      QR : API_URL + '/twofa/generate',
      twoFactorAuthenticationCode: '',
      showToast: ref(false),
      toastMsg: ref(''),
      toastMode: ref('')
    } 
  },
  components: {
    Toast
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
        this.showToast = true;
        this.toastMsg = msg;
        this.toastMode = mode;
        setTimeout(() => this.showToast = false, 2000);
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