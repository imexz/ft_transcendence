<template>
  <div>
    <router-link :to="link" :class="type">{{ label }}</router-link>
  </div>
</template>

<script lang="ts">
  import { Options,Vue } from 'vue-class-component';

  @Options ({
    props: {
      label: String,
      link: String,
      type: String,
    }
  })

  export default class NavButton extends Vue {
    label!: String
    link!: String
    type!: String
  }
</script>