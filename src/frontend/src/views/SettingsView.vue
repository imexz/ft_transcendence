<template>
  <h1>Settings</h1>
  <button @click="show">show</button>
  <Toast v-if="showToast" :msg=toastMsg :mode=toastMode />
  <h2>Change Username</h2>
  <ChangeUserName @success="changeSuccess" @error="changeError"/>
  <h2>Change Avatar</h2>
  <ChangeUserAvatar @success="changeSuccess" @error="changeError"/>
  <h2>Enable 2FA</h2>
  <EnableTwoFA/>
  <button @click="show">SHOW</button>
</template>

<script lang="ts">

  import ChangeUserName from '@/components/Settings/ChangeUserName.vue';
  import ChangeUserAvatar from '@/components/Settings/ChangeUserAvatar.vue';
  import EnableTwoFA from '@/components/Auth/enable2fc.vue';
  import Toast from '@/components/Toast.vue'
  import { ref, resolveDirective } from 'vue';

  export default {
    components: {
    ChangeUserName,
    ChangeUserAvatar,
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
      show() {
        console.log(this.$store.getters.getUser);
      },
      changeSuccess(msg: String) {
        this.showToast = true;
        this.toastMsg = msg;
        this.toastMode = 'success';
        setTimeout(() => this.showToast = false, 2000);
      },
      changeError(errorMsg: String) {
        this.toastMode = 'error';
        this.toastMsg = errorMsg;
        this.showToast = true;
        setTimeout(() => this.showToast = false, 2000);
      }
    }
  }


</script>