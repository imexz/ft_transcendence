<template>
	<div>
		<canvas
			key="componentKey"
			ref="game"
			width="640"
			height="480"
			style="border: 1px solid black;">
		</canvas>
		<div>
			<ScoreCounter />
		</div>
	</div>
</template>

<script>
	import io from "socket.io-client";
	import ScoreCounter from "./ScoreCounter.vue";
	export default {
		name: 'PongGame',
		components: {
			ScoreCounter
		},
		data() {
			return {
				// componentKey: 0,
				socket: {},
				context: {},
				eventSource: {},
				position: {
					x: 0,
					y: 0
				}
			}
		},
		created() {
			this.socket = io("http://localhost:3000");
			this.eventSource = new EventSource("http://localhost:3000/game/sse");
		},
		mounted() {
			this.eventSource.onmessage = ({data}) => {
				data = JSON.parse(data);
				this.context = this.$refs.game.getContext("2d");
				this.position.x = data.ball.position.x;
				this.position.y = data.ball.position.y;
				this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
				// this.context.fillRect(this.position.x, this.position.y, data.ball.radius, data.ball.radius);
				this.context.beginPath();
				this.context.arc(this.position.x, this.position.y, data.ball.radius, 0, 2 * Math.PI);
				this.context.fill();
			};
			// this.forceRenderer();
			// using named server sent events
			// this.eventSource.addEventListener('event', data => {
			// this.context = this.$refs.game.getContext("2d");
			// this.position = data.data;
			// this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
			// this.context.fillRect(this.position.x, this.position.y, 20, 20);
			// });

			// using socket
			// this.context = this.$refs.game.getContext("2d");
			// this.socket.on('events', data => {
			// 	this.position = data;
			// 	this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
			// 	this.context.fillRect(this.position.x, this.position.y, 20, 20);
			// } );
			// this.socket.emit('event');
		},
		// methods: {
		// 	forceRenderer() {
		// 		this.componentKey += 1;
		// 	}
		// }
	}
</script>

<style scoped>

</style>
