<template>
    <div>
      <h2>Winrate</h2>
      <svg width="100%" height="100%" viewBox="0 0 40 40">
        <circle 
        cx="20"
        cy="20"
        r="15.91549430918954"
        fill="#060317"></circle>
        <circle 
        class="donut-ring"
        cx="20"
        cy="20"
        r="15.91549430918954"
        fill="transparent"
        stroke-width="3.5"></circle>
        <circle class="donut-segment"
        cx="20" cy="20" r="15.91549430918954"
        fill="transparent"
        stroke-width="3.5"
        :stroke-dasharray="percentage"
        stroke-dashoffset="25"></circle>
        <g class="donut-text donut-text-1">
          <text y="50%" transform="translate(0, 2)">
            <tspan x="50%" text-anchor="middle" class="donut-percent">{{ ((winCount / totalGames * 100) || 0).toFixed(2) }}%</tspan>   
          </text>
          <text y="60%" transform="translate(0, 2)">
            <tspan x="50%" text-anchor="middle" class="donut-data">Games Played: {{ totalGames }}</tspan>   
          </text>
        </g>
      </svg>
      <div>
        W: {{ winCount }} L: {{ lossCount }}
      </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {}
  },
  computed: {
    percentage() {
      let p: string = (this.winCount / this.totalGames * 100).toFixed(0)
      let n: string = (100 - (this.winCount / this.totalGames * 100)).toFixed(0)
      return p + " " + n;
    }
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
  /* margin-top: 30px; */
  font-size: 25px;
  font-weight: bold;
}


.donut-ring {
    stroke: var(--ft_red);
}

.donut-segment {
    transform-origin: center;
    stroke: var(--ft_cyan);
}

.donut-text-1 {
  font-family: Arial, Helvetica, sans-serif;
  fill: var(--ft_cyan);
}

.donut-label {
    font-size: 0.28em;
    font-weight: 700;
    line-height: 1;
    fill: #000;
    transform: translateY(0.25em);
}

.donut-percent {
    font-size: 0.3em;
    line-height: 1;
    transform: translateY(0.5em);
    font-weight: bold;
}

.donut-data {
    font-size: 0.08em;
    line-height: 1;
    transform: translateY(0.5em);
    text-align: center;
    text-anchor: middle;
    color:#777;
    fill: #777;
}

</style>