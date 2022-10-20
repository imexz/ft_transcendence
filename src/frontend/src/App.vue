<template>
  <NavBar></NavBar>
  <div class="content">
    <router-view/>
  </div>
  <Footer></Footer>
</template>

<script lang="ts">

import NavBar from '@/components/NavBar/NavBar.vue';
import { defineComponent } from 'vue';
import Footer from '@/components/Footer/Footer.vue'

export default defineComponent({
  components: {
    NavBar,
    Footer,
  }    
})

</script>

<style>

:root {
    --ft_black: #000000;
    --ft_white: #FFFFFF;
    --ft_pink: #FF0088;
    --ft_blue: #0877E6;

    --ft_dark: #0c052e;
    --ft_dark: #060317;
    --ft_dark_purple: #3b1356;
    --ft_purple: #802785;
    --ft_pink:#fe0efe;
    --ft_yellow: #f5ac0e;
    --ft_cyan: #0cfbfe;
    --ft_red: #e70038;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--ft_cyan);
}

html{
  margin: 0;
  padding: 0;
  height: 100%;
  min-width: 800px;
  overflow: auto;
}

body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: var(--ft_dark);
  /* background: linear-gradient(var(--ft_dark_purple),var(--ft_dark)); */
  background-repeat: no-repeat;
}

.content {
  
  /* transform: rotateX('90deg'); */


  /* transform: rotate(90deg); */
    /* transform-origin:bottom center; */
    
    /* position:absolute; */


  animation-name: example;
  animation-duration: 20s;
  animation-iteration-count: infinite;
}

@keyframes example {
  0% {
    transform: rotate(0deg)
  }
  25% {
    transform: rotate(90deg)
  }
  50% {
    transform: rotate(180deg)
  }
  75% {
    transform: rotate(270deg)
  }
  100% {
    transform: rotate(360deg)
  }
}

</style>
