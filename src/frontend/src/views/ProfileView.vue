<template>
  <Profile :id="id" />
  <div>
    <SearchBar/>
  </div>
  <div>
    <FriendList/>
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import VueAxios from 'axios';
  import UserSummary from '@/components/Profile/UserSummary.vue';
  import SearchBar from '@/components/Profile/SearchBar.vue';
  import Profile from '@/components/Profile/Profile.vue';
  import FriendList from '@/components/Profile/FriendList.vue';
  import { API_URL } from '@/models/host';

  export default {
    data(): unknown {
      return {
        currentUser : this.$store.getters.getUser,
      }
    },
    props: {
      id: String,
    },
    components : {
      UserSummary,
      SearchBar,
      Profile,
      FriendList,
    }
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