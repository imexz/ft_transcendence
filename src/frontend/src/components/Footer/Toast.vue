<template>
  <div class="toast-wrapper" v-if="$store.state.toastShow">
    <div v-if="$store.state.toastMode === 'success'" class="toast successToast">
      SUCCESS: {{ $store.state.toastMsg }}
    </div>
    <div v-else-if="$store.state.toastMode === 'error'" class="toast errorToast">
      ERROR: {{ $store.state.toastMsg }}
    </div> 
    <div v-else-if="$store.state.toastMode === 'banned'" class="toast errorToast">
      {{ $store.state.toastMsg }}
    </div> 
    <div v-else class="toast">
      {{ $store.state.toastMsg }}
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
    bottom: 0px;
    left: 0px;
  }
  .toast {
    color: white;
    background: red;
    font-size: 25px;
    font-weight: bold;
    border-radius: 10px;
    border-width: 3px;
    border-style: solid;
    background: rgba(0, 0, 0, 100);
    z-index: 11;
    padding: 20px;
    animation: growUp 200ms linear forwards;
    transform-origin: bottom center;
  }
  @keyframes growUp {
    0% {
      transform: scaleY(0);
    }
    70% {
      transform: scaleY(1.2);
    }
    100% {
      transform: scaleY(1);
    }
  }
  .errorToast {
    padding: 20px;
    color: var(--error_color);
    border-color: var(--error_color);
  }
  .successToast {
    color: var(--succes_color);
    border-color: var(--succes_color);
  }
</style>