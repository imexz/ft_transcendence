<template>
    <div>
        <!-- <button @click="enableTwoFA"> enable two Factor </button> -->
        <img :src=QR  alt='hostURL' >
        <input v-model="twoFactorAuthenticationCode"/>
        <button @click="authenticate">validate</button>
        <button @click="on">turn-on</button>
        <button @click="off">turn-off</button>

    </div>
</template>

<script lang="ts">

import VueAxios from 'axios';
import { API_URL } from '@/models/host';

export default {
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
    },
    on() {
        VueAxios({
            url: '/users/turn-on',
            baseURL: API_URL,
            method: 'POST',
            withCredentials: true,
            data : { 'twoFactorAuthenticationCode': this.twoFactorAuthenticationCode}
        })
    },
    off() {
        VueAxios({
            url: '/users/turn-off',
            baseURL: API_URL,
            method: 'GET',
            withCredentials: true,
        })
    }
  }
}
</script>
