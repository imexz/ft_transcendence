<template>
  <Toast v-if="showToast" :msg=toastMsg :mode=toastMode />
  <h1>Settings</h1>
  <button @click="show">show Store</button>
  <h2>Change Username</h2>
  <ChangeUserName @success="changeSuccess" @error="changeError"/>
  <h2>Change Avatar</h2>
  <ChangeUserAvatar @success="changeSuccess" @error="changeError"/>
  <h2>Enable 2FA</h2>
  <EnableTwoFA/>
  <button @click="show">SHOW</button>
  <h2>API-Test</h2>
  <button @click="this.$router.push('/api_test')">goto</button>
</template>

<script lang="ts">

import ChangeUserName from '@/components/Settings/ChangeUserName.vue';
import ChangeUserAvatar from '@/components/Settings/ChangeUserAvatar.vue';
import EnableTwoFA from '@/components/Auth/enable2fc.vue';
import Toast from '@/components/Toast.vue'
import { ref } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    ChangeUserName,
    ChangeUserAvatar,
    EnableTwoFA,
    Toast,
  },
  data() {
    return {
      showToast : ref<boolean | null>(false),
      toastMsg : ref<string | null>(''),
      toastMode : ref<string | null>(''),
    }
  },
  methods: {
    show() {
      console.log(this.$store.getters.getUser);
    },
    changeSuccess(msg: string) {
      this.showToast = true;
      this.toastMsg = msg;
      this.toastMode = 'success';
      setTimeout(() => this.showToast = false, 2000);
    },
    changeError(errorMsg: string) {
      this.toastMode = 'error';
      this.toastMsg = errorMsg;
      this.showToast = true;
      setTimeout(() => this.showToast = false, 2000);
    }
  }
})

</script>