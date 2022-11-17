<template>
  <div class="container">
    <div class="statistics">
      <div class="headLine">
        Statistics
      </div>
      <div>
        <MatchStatistics
          :totalGames="matchData.length"
          :winCount="winCount"
          :lossCount="lossCount" />
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
import MatchStatistics from './MatchStatistics.vue';
import { API_URL } from '@/defines';
import VueAxios from 'axios';


export default defineComponent({
  data() {
    return {
      matchData: [] as MatchData[],
      winCount: 0 as number,
      lossCount: 0 as number, 
      lastId: "0" as string,
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
    MatchSummary,
    MatchStatistics
},
  methods: {
    initData() {
      VueAxios({
        url: ('/game/' + ((this.id == 0)?this.$store.state.user.id.toString():this.id)),
        baseURL: API_URL,
        method: 'Get',
        withCredentials: true,
      })
        .then(response => {
        this.lastId = this.id
        if(response != null)
          this.matchData = response.data
          this.calcStats()
        })
        .catch(error => { this.$emit('actions', 'error') }) 
      },
      calcStats(){     
        this.winCount = 0;
        this.lossCount = 0;   
        this.matchData.forEach(match => {
          if (match?.scoreWinner > match?.scoreLoser && match?.winner == null ||
              match?.scoreWinner < match?.scoreLoser && match?.loser == null)
            this.winCount++;
          else
            this.lossCount++;
        });
    },
  },
  mounted() {
    this.initData()
  },
  updated() {
    if (this.id != this.lastId) {
      this.initData()
    }
  }
  
})

</script>

<style scoped>

.container {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

}

.headLine {
  border-bottom: 2px solid var(--ft_cyan);
  /* border-radius: 10px; */
  font-size: 32px;
  font-weight: bold;
  padding: 10px 0px;
  /* margin-bottom: 20px; */
}

.matchHistory {
  overflow: hidden;
  border: 2px solid var(--ft_cyan);
  border-radius: 10px;
  margin-left: 5px;
  width: 66%;
}

.statistics {
  border: 2px solid var(--ft_cyan);
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