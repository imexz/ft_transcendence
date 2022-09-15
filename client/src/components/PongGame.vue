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
			document.addEventListener('keydown', (event) => {
				console.log(event.key);
				if (event.key == 'w') {
					this.paddleLeftUp();
				}
				else if (event.key == 's') {
					this.paddleLeftDown();
				}
				else if (event.key == 'ArrowUp') {
					this.paddleRightUp();
				}
				else if (event.key == 'ArrowDown') {
					this.paddleRightDown();
				}
			}, false);
		},
		mounted() {
			this.eventSource.onmessage = ({data}) => {
				data = JSON.parse(data);
				this.context = this.$refs.game.getContext("2d");
				this.position.x = data.ball.position.x;
				this.position.y = data.ball.position.y;
				this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
				this.context.beginPath();
				this.context.arc(this.position.x, this.position.y, data.ball.radius, 0, 2 * Math.PI);
				this.context.fill();
				this.drawPaddles(data);
			};

		},
		methods: {
			drawPaddles(data) {
				this.context.fillRect(data.paddleLeft.position.x, data.paddleLeft.position.y, data.paddleLeft.width, data.paddleLeft.height);
				this.context.fillRect(data.paddleRight.position.x, data.paddleRight.position.y, data.paddleRight.width, data.paddleRight.height);
			},
			paddleLeftUp() {
				this.socket.emit('moveLeftUp');
			},
			paddleLeftDown() {
				this.socket.emit('moveLeftDown');
			},
			paddleRightUp() {
				this.socket.emit('moveRightUp');
			},
			paddleRightDown() {
				this.socket.emit('moveRightDown');
			}
		}
	}
</script>

<style scoped>

</style>
