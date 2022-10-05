<template>
  <div class="top">
    <Profile :id="id" />
    <MatchHisory :id="id"/>
  </div>
  <div class="top">
    <SearchBar/>
  </div>
</template>

<script lang="ts">
  import UserSummary from '@/components/Profile/UserSummary.vue';
  import SearchBar from '@/components/Profile/SearchBar.vue';
  import Profile from '@/components/Profile/Profile.vue';
  import MatchHisory from '@/components/Profile/MatchHistory.vue'
  import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: String,
  },
  components : {
    UserSummary,
    SearchBar,
    Profile,
    MatchHisory
  }
})

</script>

<style scoped>
  .top {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  .bottom {
    display: flex;
    justify-content: center;
  }
</style>