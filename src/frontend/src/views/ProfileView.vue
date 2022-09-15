<template>
  <div>
    <h1>{{ id }}</h1>
    <img :src='this.$store.getters.getUser.avatar_url' alt='Profile Pic'>
    <h1>Welcome {{ this.$store.getters.getUser.unique_name }}</h1>
  </div>
  <div>
    <SearchBar/>
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import UserSummary from '../components/UserSummary.vue';
  import SearchBar from '@/components/SearchBar.vue';

  @Options ({
    props: {
      id: String
    },
    components : {
      UserSummary,
      SearchBar,
    }
  })

  export default class ProileView extends Vue {
    ProfilePicUrl: string = ""
    id!:string
  }
</script>

<style scoped>
  h1 {
    float: left;
    padding-left: 30px;
  }
  img {
    float: left;
    width: 300px;
    height: auto;
    border: 10px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(var(--ft_pink), var(--ft_blue));
  }
  div {
    clear: both;
    padding: 10px;
  }
</style>