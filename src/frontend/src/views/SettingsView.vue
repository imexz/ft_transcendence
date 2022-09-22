<template>
  <h1>ChangeUserName</h1>
  <ChangeUserName/>
  <ChangeUserAvatar/>
</template>

<script lang="ts">

 import { Vue, Options } from 'vue-class-component';
 import ChangeUserName from '@/components/ChangeUserName.vue';
import ChangeUserAvatar from '@/components/ChangeUserAvatar.vue';

  @Options ({
    components: {
      ChangeUserName,
      ChangeUserAvatar,
    }
  })

 export default class SettingsVue extends Vue {

 }

</script>