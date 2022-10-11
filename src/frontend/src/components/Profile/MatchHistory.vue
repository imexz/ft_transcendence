<template>
  <div class="container">
    <div class="statistics">
      <div class="headLine">
        Statistics
      </div>
      <div>
        Games Played: {{ matchData.length }}
      </div>
      <div>
      Winrate: {{ 
        (matchData.filter(obj => {
        return obj.myScore > obj.opponentScore
      }).length / matchData.length * 100).toFixed(2)}}%
      </div>
      <div>
        W: {{ (matchData.filter(obj => {
        return obj.myScore > obj.opponentScore
        }).length) }}
        L: {{ (matchData.filter(obj => {
        return obj.myScore < obj.opponentScore
        }).length) }}
        D: {{ (matchData.filter(obj => {
        return obj.myScore == obj.opponentScore
        }).length) }}
      </div>
    </div>
    <div class="matchHistory" >
      <div class="headLine">
        MatchHistory
      </div>
      <div class="matches">
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
  },
})

</script>

<style scoped>

.container {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

}

.headLine {
  border-bottom: 1px solid var(--ft_cyan);
  /* border-radius: 10px; */
  font-size: 32px;
  font-weight: bold;
  padding: 10px 0px;
  /* margin-bottom: 20px; */
}

.matchHistory {
  overflow: hidden;
  border: 1px solid var(--ft_cyan);
  border-radius: 10px;
  margin-left: 5px;
  width: 66%;
}

.statistics {
  border: 1px solid var(--ft_cyan);
  border-radius: 10px;
  margin-right: 5px;
  width: 34%;
}
.matches {
  /* border: 2px solid var(--ft_cyan); */
  /* border-radius: 10px; */
  height: 450px;
  overflow-y: scroll;
}

</style>