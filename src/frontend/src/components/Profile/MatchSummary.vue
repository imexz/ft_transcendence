<template>
  <div class="matchSummary">
    <div>
      <span class="win" v-if="win">Win</span>
      <span class="loss" v-else>Loss</span>
    </div>
    <div>
      <span>{{ match.scoreWinner }} : {{ match.scoreLoser }}</span>
    </div>
    <div>
      <UserSummary :user=get ></UserSummary>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import User from '@/models/user';
import MatchData from '@/models/matchData';
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import UserSummary from '@/components/Profile/UserSummary.vue';

export default defineComponent({
  props: {
    match: {
      type: Object,
      default: null,
    },
  },
  components: {
    UserSummary,
  },
  created() {
    // console.log(this.match);
    
  },
  computed: {
      get() {
        console.log("compute");
        return this.match.winner != null ? this.match.winner : this.match.loser;
      },
      win() {
        if (this.match?.scoreWinner > this.match?.scoreLoser && this.match?.winner == null ||
        this.match?.scoreWinner < this.match?.scoreLoser && this.match?.loser == null) {
          return true
      }
      return false
      }

  }
})

</script>

<style scoped>

.win {
  color: var(--ft_cyan);
}
.loss {
  color: var(--ft_red);
}
.draw {
  color: var(--ft_yellow);
}
.matchSummary {
  display: flex;
  align-items: center;
  font-size: 25px;
  font-weight: bold;
  padding-left: 10px;
  justify-content: space-between;
}
</style>