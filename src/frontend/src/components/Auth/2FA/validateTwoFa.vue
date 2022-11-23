<template>
    <div>
        <input
          v-model="twoFactorAuthenticationCode"
          @keydown.enter="authenticate()"/>
        <button @click="authenticate">validate</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueAxios from 'axios';
import { API_URL } from '@/defines';

export default defineComponent({
    data() {
        return {
            twoFactorAuthenticationCode: "",
        };
    },
    methods: {
      triggerToast(msg: string, mode: string) {
        this.$store.dispatch('triggerToast', {msg: msg, mode: mode, show: true})
        },
        authenticate() {
          VueAxios({
              url: "/twofa/authenticate",
              baseURL: API_URL,
              method: "POST",
              withCredentials: true,
              data: { "twoFactorAuthenticationCode": this.twoFactorAuthenticationCode }
          })
              .then(r => (this.$store.dispatch("logIn", r.data)))
              .catch(e => this.triggerToast("Validation Failed", "error"));
        }
    }
})
</script>