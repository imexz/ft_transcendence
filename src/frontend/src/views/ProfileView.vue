<template>
  <Profile :pid=parseInt(id) />
  <div>
    <SearchBar/>
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import UserSummary from '../components/Profile/UserSummary.vue';
  import SearchBar from '@/components/Profile/SearchBar.vue';
  import Profile from '@/components/Profile/Profile.vue';
import { computed } from '@vue/reactivity';

  @Options ({
    props: {
      id: String,
    },
    components : {
      UserSummary,
      SearchBar,
      Profile,
    }
  })

  export default class ProileView extends Vue {
    id!:string

    mounted(): void {
      this.$forceUpdate()
      console.log(this.id)
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