<template>
  <div>
    <div v-if="!this.$store.getters.isLogged">
      <h1>Please login</h1>
      <button @click="validateUser">validate AUTH</button>
      <EnableTwoFA/>
    </div>
    <div v-else>
      <h1 >Already logged in</h1>
    </div>
  </div>
</template>

<script lang ="ts">
  import { Vue, Options } from 'vue-class-component';
  import EnableTwoFA from '@/components/Auth/enable2fc.vue';

  @Options ({
    components: {
      EnableTwoFA,
    }
  })

  export default class LoginView extends Vue {
  }
</script>