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


import { Options, Vue } from 'vue-class-component';
import VueAxios from 'axios';
import { hostURL } from '@/models/host';



export default class EnableTwoFA extends Vue{

    QR = hostURL + ':3000' + '/twofa/generate';
    twoFactorAuthenticationCode: string = '';


    authenticate() {
        VueAxios({
            url: '/twofa/authenticate',
            baseURL: hostURL + ':3000',
            method: 'POST',
            withCredentials: true,
            data : { 'twoFactorAuthenticationCode': this.twoFactorAuthenticationCode}
        })
    }

    on() {
        VueAxios({
            url: '/users/turn-on',
            baseURL: hostURL + ':3000',
            method: 'POST',
            withCredentials: true,
            data : { 'twoFactorAuthenticationCode': this.twoFactorAuthenticationCode}
        })
    }

    off() {
        VueAxios({
            url: '/users/turn-off',
            baseURL: hostURL + ':3000',
            method: 'GET',
            withCredentials: true,
        })
    }


}
</script>
