<template>
    <div>
    Games Played: {{ totalGames }}
    </div>
    <div>
      W: {{ winCount }} L: {{ lossCount }}
    </div>
    <div>
      <svg width="200" height="50">
        <rect 
        :width="(winCount/ totalGames * 200)"
        height="50"
        style="fill:#0cfbfe"
        />
        <rect 
        :x="(winCount/ totalGames * 200)"
        :width="(lossCount/ totalGames * 200)"
        height="50"
        style="fill:#e70038"
        />
      </svg>
    </div>    
    <div>
    Winrate: {{ (winCount / totalGames * 100).toFixed(2)}}%
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {}
  },
  props: {
    totalGames: {
      type: Number,
      default: 0
     },
    winCount: {
      type: Number,
      default: 0
     },
    lossCount: {
      type: Number,
      default: 0
     }, 
  }
})

</script>

<style scoped>

div {
  margin-top: 30px;
  font-size: 25px;
  font-weight: bold;
}

</style>