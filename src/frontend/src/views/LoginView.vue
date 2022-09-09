<template>
  <div>
    <FtAuth v-if="!this.$store.getters.isValidated"></FtAuth>
    <LogoutButton v-else></LogoutButton>
  </div>
</template>

<script lang ="ts">
  import { Vue, Options } from 'vue-class-component';
  import FtAuth from '@/components/FtAuth.vue';
  import LogoutButton from '@/components/LogoutButton.vue';


  @Options({
    components: {
      FtAuth,
      LogoutButton,
    }
  })

  export default class LoginView extends Vue {}
</script>