<template>
  <div>
    <FtAuth v-if="!this.$store.getters.isLogged"></FtAuth>
    <LogoutButton v-else></LogoutButton>
  </div>
</template>

<script lang ="ts">
  import { Vue, Options } from 'vue-class-component';
  import FtAuth from '@/components/Auth/FtAuth.vue';
  import LogoutButton from '@/components/Auth/LogoutButton.vue';


  @Options({
    components: {
      FtAuth,
      LogoutButton,
    }
  })

  export default class LoginView extends Vue {
  }
</script>