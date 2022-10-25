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
    margin-top: 70px;
    margin-bottom: 80px;
    background-color: var(--ft_dark);
    margin-bottom: 80px;
    /* border: 2px solid var(--ft_cyan); */
    /* border-radius: 10px 10px 0px 0px; */
    /* background: linear-gradient(0deg ,var(--ft_cyan), var(--ft_dark) 80%, var(--ft_pink)) ; */
  }
</style>