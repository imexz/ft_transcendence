<template>
  <div class="matchSummary">
    <div>
      <span class="loss" v-if="this.match.winner">Loss</span>
      <span class="win" v-else>Win</span>
    </div>
    <div>
      <span>{{ this.match.scoreWinner }} : {{ this.match.scoreLoser }}</span>
    </div>
    <div>
      <UserSummary :user=get ></UserSummary>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
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
  computed: {
      get() {
        return this.match.winner != null ? this.match.winner : this.match.loser;
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