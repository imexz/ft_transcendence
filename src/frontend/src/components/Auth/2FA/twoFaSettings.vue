<template>
  <Toast v-if="showToast" :msg=toastMsg :mode=toastMode />
    <div>
        <div v-if="showQr == false && $store.state.user.isTwoFactorAuthenticationEnabled == false">
            <div> With 2-factor authentication, an extra layer of security is added to your account to prevent someone from logging in, even if they have your password. This extra security measure requires you to verify your identity using a randomized 6-digit code Google Authenticator generate to log in.</div>
            <br/><br/>
            <button @click="toggleQr"> Enable two factor authentication</button>
        </div>
        <div v-else-if="showQr == true" > 
            <div>
                <div> scann QR code and Enter the code to enable 2-factor Authentication</div>
                <br/>
                <img id="image" :src=QR  alt='hostURL' >
            </div>
            <br/>
            <input v-model="twoFactorAuthenticationCode" placeholder="Enter Code"/>
            <button @click="on">turn on two factor </button>

        </div>
        <div v-else>
                <h2>Code needed to turn off two factor authentication </h2>
                <input v-model="twoFactorAuthenticationCode" placeholder="Enter Code"/>
                <button @click="off">turn off two factor </button>
            <button @click="toggleQr">generate new secret </button>
        </div>
    </div>
</template>

<script lang="ts">
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { defineComponent, ref } from 'vue';
import Toast from '@/components/Toast.vue';

export default defineComponent({    
    data() {
        return{
            showQr: false,
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
        toggleQr: function () {
            this.showQr = !this.showQr;
        },
        triggerToast(msg: string, mode: string) {
            this.showToast = true;
            this.toastMsg = msg;
            this.toastMode = mode;
            setTimeout(() => this.showToast = false, 2000);
        },
        on() {
            VueAxios({
                url: '/twofa/turn-on',
                baseURL: API_URL,
                method: 'POST',
                withCredentials: true,
                data : { 'twoFactorAuthenticationCode': this.twoFactorAuthenticationCode}
            })
            .then(r => {this.triggerToast("2FA activated", "success")
                        this.$store.commit('setTwoFa', true)
                        this.twoFactorAuthenticationCode = ''
                        this.showQr = false})
            .catch(e => this.triggerToast(e.response, "error"))

        },
        off() {
        VueAxios({
            url: '/twofa/turn-off',
            baseURL: API_URL,
            method: 'GET',
            withCredentials: true,
        })
        .then(r => {this.triggerToast("2FA disabled", "success")
                    this.$store.commit('setTwoFa', false)
                    this.twoFactorAuthenticationCode = ''})
        .catch(e => this.triggerToast(e.response, "error"))
        }

    }
})
</script>