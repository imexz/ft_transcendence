<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/login">Login</router-link>
  </nav>
  <router-view/>
</template>

<script lang="ts">
  import { Vue } from 'vue-class-component';

  export default class App extends Vue {
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(8, 119, 230);
}

body {
  background-color: #000000;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #c815cb;
}

nav a.router-link-exact-active {
  color: rgb(8, 119, 230);
}

button {
    background-color: #000000;
    color: #FFFFFF;
    padding: 15px 32px;
    font-size: 32px;
    font-weight: bold;
    margin: auto;
    /* border: 5px solid linear-gradient(to left, red, yellow); */
    border-image: linear-gradient(rgb(255, 0, 136), rgb(8, 119, 230)) 30;
  }
</style>
