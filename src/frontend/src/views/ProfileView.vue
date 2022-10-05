<template>
  <div class="top">
    <Profile :id="id" />
    <MatchHisory :id="id"/>
  </div>
</template>

<script lang="ts">
  import UserSummary from '@/components/Profile/UserSummary.vue';
  import Profile from '@/components/Profile/Profile.vue';
  import MatchHisory from '@/components/Profile/MatchHistory.vue'
  import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: String,
  },
  components : {
    UserSummary,
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