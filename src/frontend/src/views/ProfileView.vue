<template>
  <div class="wrapper">
    <div class="profileDeco">
      <Profile :id="id" />
    </div>
    <div class="matchStatistics">
      <MatchHisory :id="id"/>
    </div>
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
  .wrapper {
    display: block;
    margin: auto;
    width: 800px;
    margin-top: 60px;
    margin-bottom: 80px;
    background-color: var(--ft_dark);
  }
</style>