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
 }

</script>