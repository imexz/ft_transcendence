<template>
  <div class="site">
    <NavBar></NavBar>
    <router-view class="routerView"/>
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import NavBar from '@/components/NavBar/NavBar.vue';
  import SideBar from '@/components/SideBar/SideBar.vue'

  @Options ({
    components: {
      NavBar,
      SideBar,
    }
  })

  export default class App extends Vue {    
  }

</script>

<style>

:root {
    --ft_black: #000000;
    --ft_white: #FFFFFF;
    --ft_pink: #FF0088;
    --ft_blue: #0877E6;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--ft_blue);
}

html, body {
  margin: 0;
  padding: 0;
}

img {
  width: 400;
  height: auto;
}

body {
  background-color: var(--ft_black);
}

button {
    background-color: var(--ft_black);
    color: var(--ft_white);
    padding: 15px 32px;
    font-size: 32px;
    font-weight: bold;
    margin: auto;
    border-image: linear-gradient(var(--ft_pink), var(--ft_blue)) 30;
  }
select {
    background-color: var(--ft_black);
    color: var(--ft_white);
    padding: 15px 32px;
    font-size: 32px;
    font-weight: bold;
    margin: auto;
    border-image: linear-gradient(var(--ft_pink), var(--ft_blue)) 30;
  }
input {
    background-color: var(--ft_black);
    color: var(--ft_white);
    padding: 15px 32px;
    font-size: 32px;
    font-weight: bold;
    margin: auto;
    border-image: linear-gradient(var(--ft_pink), var(--ft_blue)) 30;
  }
</style>
