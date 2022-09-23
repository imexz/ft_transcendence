<template>
  <h1>Settings</h1>
  <ChangeUserName/>
  <ChangeUserAvatar/>
  <EnableTwoFA/>
</template>

<script lang="ts">

 import { Vue, Options } from 'vue-class-component';
 import ChangeUserName from '@/components/ChangeUserName.vue';
import ChangeUserAvatar from '@/components/ChangeUserAvatar.vue';
import EnableTwoFA from '@/components/enable2fc.vue';
import Enable2fc from '../components/enable2fc.vue';

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