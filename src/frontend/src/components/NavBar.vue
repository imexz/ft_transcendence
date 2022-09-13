<template>
  <nav>
    <NavButton
      v-for="site in (sites)"
      :link="site.link"
      :label="site.label"
      :type="site.type">
    </NavButton>
  </nav>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import NavButton from './NavButton.vue';

  @Options({
    components: {
      NavButton
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
        label: 'Profile',
        link: '/profile',
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
  width: 17%;
  font-size: 25px;
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
  font-size: 35px;
  font-weight: bold;
  color: var(--ft_white);
  width: 34%;
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