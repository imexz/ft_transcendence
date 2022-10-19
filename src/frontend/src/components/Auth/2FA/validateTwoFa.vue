<template>
    <Toast v-if="showToast" :msg=toastMsg :mode=toastMode />
    <div>
        <input
          v-model="twoFactorAuthenticationCode"
          @keydown.enter="authenticate()"/>
        <button @click="authenticate">validate</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import Toast from '@/components/Toast.vue';

export default defineComponent({
    data() {
        return {
            showToast: ref(false),
            toastMsg: ref(''),
            toastMode: ref(''),
            twoFactorAuthenticationCode: "",
        };
    },
    methods: {
      triggerToast(msg: string, mode: string) {
            this.showToast = true;
            this.toastMsg = msg;
            this.toastMode = mode;
            setTimeout(() => this.showToast = false, 2000);
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
    },
    components: { Toast }
})
</script>