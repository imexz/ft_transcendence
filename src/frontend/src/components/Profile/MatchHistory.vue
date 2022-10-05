<template>
  <div class="matchHistory">
    <div>
      <h1>MatchHistory</h1>
    </div>
    <div v-for="match in matchData">
      <MatchSummary :match=match></MatchSummary>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import MatchData from '@/models/matchData';
import UserSummary from '@/components/Profile/UserSummary.vue';
import MatchSummary from './MatchSummary.vue';

export default defineComponent({
  data() {
    return {
      matchData: [
        { opponent: 1, myScore: 6, opponentScore: 10 },
        { opponent: 2, myScore: 10, opponentScore: 3},
        { opponent: 2, myScore: 10, opponentScore: 10},
      ] as MatchData[],
    }
  },
  props: {
    id: {
      type: String,
      default: "0"
    },
  },
  components: {
    UserSummary,
    MatchSummary
}
})

</script>

<style scoped>

.matchHistory {
  width: 480px;
}

</style>