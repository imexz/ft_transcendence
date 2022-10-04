<template>
  <div>
    <div v-if="!this.$store.getters.isLogged">
      <h1>Please login</h1>
      <EnableTwoFA/>
    </div>
    <div v-else>
      <h1 >Already logged in</h1>
    </div>
  </div>
</template>

<script lang ="ts">

import EnableTwoFA from '@/components/Auth/enable2fc.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    EnableTwoFA,
  }  
})

</script>