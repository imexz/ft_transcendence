<template>
  <div class="top">
    <Profile :id="id" />
    <MatchHisory/>
  </div>
  <div class="top">
    <SearchBar/>
    <FriendList/>
  </div>
</template>

<script lang="ts">
  import UserSummary from '@/components/Profile/UserSummary.vue';
  import SearchBar from '@/components/Profile/SearchBar.vue';
  import Profile from '@/components/Profile/Profile.vue';
  import FriendList from '@/components/Profile/FriendList.vue';
  import MatchHisory from '@/components/Profile/MatchHistory.vue'
  import { defineComponent } from 'vue';

export default defineComponent({
  data() {
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