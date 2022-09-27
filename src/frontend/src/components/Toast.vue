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
  export default {
    props: {
      msg: String,
      mode: String,
    }
  }
</script>

<style scoped>
  .toast-wrapper {
    --error_color: #f60445;
    --succes_color: #21e6f8;
    float: right;
    position: fixed;
    width: 400px;
    bottom: 20px;
    right: 20px;
  }
  .toast {
    padding: 20px;
    color: white;
    background: red;
    border-radius: 10px;
    box-shadow: 1px 3px 5px, rgb(5, 186, 252);
    margin: 0, auto;
  }
  .errorToast {
    padding: 20px;
    background: rgba(0, 0, 0, 100);
    color: var(--error_color);
    border: 3px solid var(--error_color);
    font-size: 20px;
    border-radius: 10px;
    margin: 0, auto;
  }
  .successToast {
    padding: 20px;
    background: rgba(0, 0, 0, 100);
    color: var(--succes_color);
    border: 3px solid var(--succes_color);
    font-size: 20px;
    border-radius: 10px;
    margin: 0, auto;
  }
</style>