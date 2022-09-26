<template>
  <nav>
    <NavButton
      v-for="site in (sites)"
      :link="site.link"
      :label="site.label"
      :type="site.type"></NavButton>
      <FtAuth/>
  </nav>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import NavButton from './NavButton.vue';
  import FtAuth from '../Auth/FtAuth.vue';

  @Options({
    components: {
      NavButton,
      FtAuth,
    }
  })

  export default class NavBar extends Vue {
    sites : any = [
      {
        label: 'Home',
        link: '/',
        type: 'left'
      },
      {
        label: 'ApiTest',
        link: '/api_test',
        type: 'left'
      },
      {
        label: 'Chats',
        link: '/chat',
        type: 'left'
      },
      {
        label: 'Play',
        link: '/play',
        type: 'middle'
      },
      {
        label: 'Login',
        link: '/login',
        type: 'right'
      },
      {
        label: 'Settings',
        link: '/settings',
        type: 'right'
      },
      {
        label: 'Profile',
        link: '/profile/',
        type: 'right'
      },
    ]
  }
</script>

<style>
nav {
  padding-top: 20px;
  padding-bottom: 80px;
}

nav a {
  font-weight: bold;
  color: var(--ft_pink);
  text-decoration: none;
  /* width: 10%; */
  font-size: 25px;
  padding: 10px;
}

nav a.router-link-exact-active {
  color: var(--ft_blue);
}
nav a.left {
  float: left;
}

nav a.right {
  float: right;
}

nav a.middle {
  text-align: center;
  /* display: block; */

  font-size: 35px;
  font-weight: bold;
  color: var(--ft_white);
  /* width: 400px; */
  background-size: auto;
  background-image: linear-gradient(var(--ft_pink), var(--ft_blue));
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 10px;
  padding-bottom: 10px;
}
nav a.middle.router-link-exact-active {
  color: var(--ft_white)
}
</style>