<template>
  <h1>ChangeUserName</h1>
  <ChangeUserName/>
</template>

<script lang="ts">

 import { Vue, Options } from 'vue-class-component';
 import ChangeUserName from '@/components/Settings/ChangeUserName.vue';

  @Options ({
    components: {
      ChangeUserName,
    }
  })

 export default class SettingsVue extends Vue {
  beforCreate(): void {
      if (!this.$store.getters.isLogged) {
        this.$router.push({ name: 'login'})
      }
    }
 }

</script>