<template>
  <div class="toast-wrapper">
    <div v-if="mode === 'success'" class="successToast">
      SUCCESS: {{ msg }}
    </div>
    <div v-else-if="mode === 'error'" class="errorToast">
      ERROR: {{ msg }}
    </div> 
    <div v-else class="toast">
      {{ msg }}
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    msg: {
      type: String,
      default: 'Please give me a meaning',
    },
    mode: {
      type: String,
      default: '',
    }
  }
})

</script>

<style scoped>
  .toast-wrapper {
    --error_color: var(--ft_red);
    --succes_color: var(--ft_cyan);
    float: right;
    position: fixed;
    width: 400px;
    bottom: 80px;
    left: 20px;
  }
  .toast {
    padding: 20px;
    color: white;
    background: red;
    border-radius: 10px;
    font-weight: bold;
    z-index: 11;
  }
  .errorToast {
    padding: 20px;
    background: rgba(0, 0, 0, 100);
    color: var(--error_color);
    border: 3px solid var(--error_color);
    font-size: 25px;
    font-weight: bold;
    border-radius: 10px;
    z-index: 11;
  }
  .successToast {
    padding: 20px;
    background: rgba(0, 0, 0, 100);
    color: var(--succes_color);
    border: 3px solid var(--succes_color);
    font-size: 25px;
    font-weight: bold;
    border-radius: 10px;
    z-index: 11;
  }
</style>