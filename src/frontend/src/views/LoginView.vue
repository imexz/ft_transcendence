<template>
  <div class="wrapper">
    <div v-if="!this.$store.getters.isLogged">
      <div v-if=tfa>
        <h1>
          Please enter your Google Authenticator Code
        </h1>
        <EnableTwoFA/>
      </div>
      <div v-else>
        <h1>Please login</h1>
        <button @click="login">login</button>
      </div>
    </div>
    <div v-else>
      <h1>Successfully logged in</h1>
    </div>
  </div>
</template>

<script lang ="ts">

import EnableTwoFA from '@/components/Auth/2FA/validateTwoFa.vue';
import { defineComponent } from 'vue';
import { API_URL } from '@/defines'

export default defineComponent({
  components: {
    EnableTwoFA,
  },
  props: {
    tfa: Boolean
  },
  methods: {
    login() {
      location.href = API_URL + '/auth/login'
    }
  }
})

</script>

<style scoped>

.wrapper {
  margin: auto;
  margin-top: 80px;
  width: 800px;
}

:deep() button {
    color: var(--ft_cyan);
    border: 2px solid var(--ft_cyan);
    border-radius: 10px;
    background-color: var(--ft_dark);
    padding: 14px 24px;
    font-size: 25px;
    font-weight: bold;
  }
  :deep() button:active {
    transform: translateY(1px);
  }
  :deep() button:hover {
    color: var(--ft_dark);
    background-color: var(--ft_cyan);
  }
  
  :deep() input {
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    border: 2px solid var(--ft_cyan);
    border-radius: 10px;
    background-color: var(--ft_dark);
    padding: 14px 24px;
    font-size: 25px;
    font-weight: bold;
  }

</style>