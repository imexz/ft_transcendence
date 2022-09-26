<template>
  <h1>Settings</h1>
  <ChangeUserName/>
  <ChangeUserAvatar/>
  <EnableTwoFA/>
</template>

<script lang="ts">

 import { Vue, Options } from 'vue-class-component';
 import ChangeUserName from '@/components/Settings/ChangeUserName.vue';
import ChangeUserAvatar from '@/components/Settings/ChangeUserAvatar.vue';
import EnableTwoFA from '@/components/Auth/enable2fc.vue';

  @Options ({
    components: {
      ChangeUserName,
      ChangeUserAvatar,
      EnableTwoFA,
    }
  })

 export default class SettingsVue extends Vue {
 }

</script>