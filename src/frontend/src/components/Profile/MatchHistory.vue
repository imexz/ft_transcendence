<template>
  <div class="container">
    <div class="statistics">
      Games Played: {{ matchData.length }}
    </div>
    <div>
      <div class="headLine">
        MatchHistory
      </div>
      <div class="matchHistory">
        <div v-for="match in matchData">
          <MatchSummary :match=match></MatchSummary>
        </div>
      </div>
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
        { opponent: 1, myScore: 6, opponentScore: 10 },
        { opponent: 1, myScore: 6, opponentScore: 10 },
        { opponent: 2, myScore: 10, opponentScore: 3},
        { opponent: 2, myScore: 10, opponentScore: 10},
        { opponent: 1, myScore: 6, opponentScore: 10 },
        { opponent: 2, myScore: 10, opponentScore: 3},
        { opponent: 2, myScore: 10, opponentScore: 3},
        { opponent: 2, myScore: 10, opponentScore: 10},
        { opponent: 2, myScore: 10, opponentScore: 10},
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

.container {
  display: flex;
}

.headLine {
  border: 1px solid var(--ft_cyan);
  border-radius: 10px;
  font-size: 32px;
  font-weight: bold;
  padding: 10px 0px;
  margin-bottom: 20px;
}

.matchHistory {
  border: 10px solid var(--ft_cyan);
  /* border-radius: 10px; */
  height: 450px;
  overflow-y: scroll;
}

</style>