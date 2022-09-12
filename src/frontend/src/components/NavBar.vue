<template>
  <nav>
    <router-link to="/" class="left">Home</router-link><p>|</p>
    <router-link to="/about">About</router-link> |
    <router-link to="/login" class="right">Login</router-link>

    <!-- <router-link v-for="(site, i) in sites" to=site.link >site.label</router-link> -->
  </nav>
</template>

<script lang="ts">
  import { Vue } from 'vue-class-component';

  export default class NavBar extends Vue {
    sites : any = [
      {
        label: 'Home',
        link: '/'
      },
      {
        label: 'About',
        link: '/about'
      },
      {
        label: 'Play',
        link: '/play'
      },
      {
        label: 'Profile',
        link: '/profile'
      },
      {
        label: 'Login',
        link: '/login'
      }
    ]
  }
</script>

<style>
  nav {
  padding: 80px;
}

nav a {
  font-weight: bold;
  color: var(--ft_pink);
}

nav a.router-link-exact-active {
  color: var(--ft_blue);
}
nav a.left {
  float: left;
}

p {
  float: left;
}

nav a.right {
  float: right;
}
</style>