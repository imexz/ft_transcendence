<template>
  <div>
		<canvas
			key="componentKey"
			ref="game"
			width="640"
			height="480"
			style="border: 1px solid white;"
		>
		</canvas>
		<div>
			<ScoreCounter />
		</div>
	</div>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import ScoreCounter from '@/components/Game/ScoreCounter.vue'
  import io from "socket.io-client";
  import { API_URL } from '@/defines';

  @Options({
    components: {
      ScoreCounter
    }
  })

export default class PongGame extends Vue {
	gameId: string = ""
	socket: any
	context: any = {}
	eventSource: any = {}
	position: any = {
		x: 0,
		y: 0
	}
	side: string = ""

	created() { // always called when Component is initialized (e.g. on refresh)
		console.log("in created");
		// TODO: ask backend for infos on existing game (gameId, which side, etc)
		this.socket = io(API_URL, {
			auth: (cb) => {
				cb ({id: this.$store.getters.getUser.id })
			}
		});
		this.socket.on('gameId', (data) => {
			console.log("event gameId received");
			console.log(data.gameId);
			console.log(data.side);
			this.gameId = data.gameId;
			this.side = data.side;
			console.log("received GameId", this.gameId);
			this.eventSource = new EventSource(API_URL + "/game/sse/" + this.gameId);
		});
		this.socket.emit('joinQueue');
		this.socket.emit('checkGame');
		document.addEventListener('keydown', (event) => {
			if (this.side === "left") {
				if (event.key == 'w') {
					console.log(event.key);
					this.paddleLeftUp();
				}
				else if (event.key == 's') {
					console.log(event.key);
					this.paddleLeftDown();
				}
			} else if (this.side === "right") {
				if (event.key == 'ArrowUp') {
					console.log(event.key);
					this.paddleRightUp();
				}
				else if (event.key == 'ArrowDown') {
					console.log(event.key);
					this.paddleRightDown();
				}
			}
		}, false);
	}

	mounted() {
		console.log("in mounted");	
		this.eventSource.onmessage = (raw_data:  any) => {
			console.log("event received");

			// console.log(raw_data);
			let data = JSON.parse(raw_data.data);
			console.log(data);
			this.context = (this.$refs.game as any).getContext("2d");
			this.context.fillStyle = "#FFFFFF";
			this.position.x = data.ball.position.x;
			this.position.y = data.ball.position.y;
			this.context.clearRect(0, 0, (this.$refs.game as any).width, (this.$refs.game as any).height);
			this.context.beginPath();
			this.context.arc(this.position.x, this.position.y, data.ball.radius, 0, 2 * Math.PI);
			this.context.fill();
			this.drawPaddles(data);
		};
	}

	beforeDestory() {
		console.log("in beforeDestroy");
		this.eventSource.close();
		delete this.eventSource;
		this.socket.close();
		delete this.socket;
		delete this.position;
		delete this.context;
		// delete this.gameId;
	}

	drawPaddles(data: any) {
		this.context.fillStyle = "#FFFFFF";
		this.context.fillRect(data.paddleLeft.position.x, data.paddleLeft.position.y, data.paddleLeft.width, data.paddleLeft.height);
		this.context.fillRect(data.paddleRight.position.x, data.paddleRight.position.y, data.paddleRight.width, data.paddleRight.height);
	}
	paddleLeftUp() {
		this.socket.emit('moveLeftUp');
	}
	paddleLeftDown() {
		this.socket.emit('moveLeftDown');
	}
	paddleRightUp() {
		this.socket.emit('moveRightUp');
	}
	paddleRightDown() {
		this.socket.emit('moveRightDown');
	}
}
</script>

<style scoped>

</style>
