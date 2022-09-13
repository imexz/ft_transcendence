<template>
	<div id = "scoreLeft">
		{{left}}
	</div>
	<div id = "scoreRight">
		{{right}}
	</div>
</template>

<script>

	export default {
		name: 'ScoreCounter',
		data() {
			return {
				left: 0,
				right: 0,
			}
		},
		created() {
			this.eventSource = new EventSource("http://localhost:3000/game/sse");
		},
		mounted() {
			this.eventSource.onmessage = ({data}) => {
			data = JSON.parse(data);
			this.left = data.score.scoreLeft;
			this.right = data.score.scoreRight;
			};
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
