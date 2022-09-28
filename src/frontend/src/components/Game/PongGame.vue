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
  import { API_URL } from '@/models/host';

  @Options({
    components: {
      ScoreCounter
    }
  })

export default class PongGame extends Vue {
	gameId: string = ""
	socket:any = undefined

	context:any = {}
	eventSource:any = {}
	position:any = {
		x: 0,
		y: 0
	}
	created() {
		console.log("in created");
		if (this.socket === undefined) {
			console.log("socket undefined");
			this.socket = io(API_URL, {
				auth: (cb) => {
					cb ({id: this.$store.getters.getUser.id })
				}
			});
			this.socket.on('gameId', (gameid: string) => {
				this.gameId = gameid;
				console.log("new GameId %d", gameid);
				this.eventSource = new EventSource(API_URL + "/game/sse/" + this.gameId);
			})
			this.socket.emit('joinQueue');
	
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
		} else {
			console.log("socket existent");
		}
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
