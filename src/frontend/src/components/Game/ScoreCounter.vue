<template>
	<div id = "scoreLeft">
		{{left}}
	</div>
	<div id = "scoreRight">
		{{right}}
	</div>
</template>

<script lang="ts">

import { API_URL } from '@/defines';
  import { Vue } from 'vue-class-component'

	export default class ScoreCounter extends Vue {
    left: number = 0
    right: number = 0
    eventSource: any

		created() {
			// this.eventSource = new EventSource(API_URL + "/game/sse");
		}
		mounted() {
			// this.eventSource.onmessage = ({data} : {data: any}) => {
			// data = JSON.parse(data);
			// this.left = data.score.scoreLeft;
			// this.right = data.score.scoreRight;
			// };
		}
	}
</script>

<style scoped>
#scoreLeft {
  transform-style: preserve-3d;
  font-size:90px;
  line-height: 90px;
  float: left;
  position: relative;
}
#scoreRight {
  transform-style: preserve-3d;
  font-size:90px;
  line-height: 90px;
  float: left;
  position: relative;
  left: 560px;
}
</style>
