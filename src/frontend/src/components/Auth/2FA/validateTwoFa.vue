<template>
    <div>
        <input v-model="twoFactorAuthenticationCode"/>
        <button @click="authenticate">validat </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueAxios from 'axios';
import { API_URL } from '@/defines';

export default defineComponent({
    data() {
        return{
            twoFactorAuthenticationCode: ''
        }
    },
    methods: {
        authenticate() {
            VueAxios({
                url: '/twofa/authenticate',
                baseURL: API_URL,
                method: 'POST',
                withCredentials: true,
                data : { 'twoFactorAuthenticationCode': this.twoFactorAuthenticationCode }
            })
            .then(r => (this.$store.dispatch('logIn', r.data)))
            .catch(e => this.triggerToast(e.response, "error"))

        }
        
    }
})
</script>