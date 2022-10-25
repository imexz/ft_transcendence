<template>
  <div class="matchSummary">
    <div>
      <span class="win" v-if="match?.myScore > match?.opponentScore">Win</span>
      <span class="loss" v-else-if="match?.myScore < match?.opponentScore">Loss</span>
      <span class="draw" v-else>Draw</span>
    </div>
    <div>
      <span>{{ match.myScore }} : {{ match.opponentScore }}</span>
    </div>
    <div>
      <UserSummary :user=user! ></UserSummary>
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
  data() {
    return {
      user: null as User | null,
    }
  },
  components: {
    UserSummary,
  },
  created() {
    VueAxios({
      url: '/users/find/' + this.match?.opponent,
      baseURL: API_URL,
      method: 'GET',
      withCredentials: true,
    })
      .then(response => { this.user = response.data })
      .catch()
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