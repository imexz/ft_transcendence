<template>
  <div>
    <div v-if="!this.$store.getters.isLogged">
      <h1>Please login</h1>
      <div>
        <EnableTwoFA/>
      </div>
    </div>
    <div v-else>
      <h1 >Already logged in</h1>
    </div>
  </div>
</template>

<script lang ="ts">

import EnableTwoFA from '@/components/Auth/2FA/validateTwoFa.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    EnableTwoFA,
  }  
})

</script>