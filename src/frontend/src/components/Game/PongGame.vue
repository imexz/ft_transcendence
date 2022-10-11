<template>
  <div v-if="gameId">
		<canvas
			key="componentKey"
			ref="game"
			width="640"
			height="480"
			style="border: 1px solid white;"
		>
		</canvas>
		<!-- <div>
			<ScoreCounter />
		</div> -->
		<div id = "scoreLeft">
			{{left}}
		</div>
		<div id = "scoreRight">
			{{right}}
		</div>
	</div>
	<div class="queue" v-else >
		Waiting for a match...
	</div>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import ScoreCounter from '@/components/Game/ScoreCounter.vue'
  import { io, Socket } from "socket.io-client";
  import { API_URL } from '@/defines';
  import { defineComponent } from 'vue';

  export default defineComponent({
  	data () {
  		return {
			isFirstCall: true as boolean,
  			gameId: "" as string,
  			gamesocket: null as Socket,
  			context: null as any,
  			side: "" as string,
			left: 0 as number,
			right: 0 as number,
			finished: false as boolean,
  		}
  	},
  	components: {
  		// ScoreCounter
  	},
  	created() { // always called when Component is initialized (e.g. on refresh)
  		console.log("in created");
  		this.gamesocket = io(API_URL + '/game', {
  			auth: (cb: any) => {
  				cb ({id: this.$store.getters.getUser._id })
  			}
  		});
  		this.gamesocket.on('gameInfo', (data: any) => {
  			console.log("event gameInfo received");
  			this.gameId = data.gameId;
  			this.side = data.side;
			this.finished = false;
  			console.log("received GameId: %s, side: %s", this.gameId, this.side);
  			document.addEventListener('keydown', (event) => {
  				if (this.side === "left" && !this.finished) {
  					if (event.key == 'w') {
  						console.log(event.key);
  						this.paddleLeftUp();
  					}
  					else if (event.key == 's') {
  						console.log(event.key);
  						this.paddleLeftDown();
  					}
  				} else if (this.side === "right" && !this.finished) {
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
  		});
  		this.gamesocket.emit('checkGame', (res: boolean) => {
  			if (!res) {
  				console.log("calling checkQueue");
  				this.gamesocket.emit('checkQueue');
  			}
  		});
  		console.log("leaving created");
  	},
  	mounted() {
  		console.log("in mounted");
  		console.log("leaving mounted");
  	},
	beforeUpdate() {
		console.log("in beforeUpdate");
		if (this.gameId && this.isFirstCall) {
			this.gamesocket.on('updateGame', (data: any) => {
				console.log("callback updateGame");
				if (data === undefined) {
  					console.log("data undefined");
					this.gameId = "";
					this.side = "";
					this.left = 0;
					this.right = 0;
  					return;
  				}
				this.finished = data.finished;
				this.left = data.score.scoreLeft;
				this.right = data.score.scoreRight;
				console.log(data);
  				this.context = (this.$refs.game as any).getContext("2d");
  				this.context.fillStyle = "#FFFFFF";
  				this.context.clearRect(0, 0, (this.$refs.game as any).width, (this.$refs.game as any).height);
  				this.context.beginPath();
  				this.context.arc(data.ball.position.x, data.ball.position.y, data.ball.radius, 0, 2 * Math.PI);
  				this.context.fill();
  				this.drawPaddles(data);
			})
			// this.isFirstCall = false;
		}
		console.log("leaving beforeUpdate");

	},

  	beforeDestory() {
  		console.log("in beforeDestroy");
  		delete this.eventSource;
  		this.gamesocket.close();
  		delete this.gamesocket;
  		// delete this.position;
  		delete this.context;
  		// delete this.gameId;
  	},
  	methods: {
  		drawPaddles(data: any) {
  			this.context.fillStyle = "#FFFFFF";
  			this.context.fillRect(data.paddleLeft.position.x, data.paddleLeft.position.y, data.paddleLeft.width, data.paddleLeft.height);
  			this.context.fillRect(data.paddleRight.position.x, data.paddleRight.position.y, data.paddleRight.width, data.paddleRight.height);
  		},
  		paddleLeftUp() {
  			this.gamesocket.emit('moveLeftUp');
  		},
  		paddleLeftDown() {
  			this.gamesocket.emit('moveLeftDown');
  		},
  		paddleRightUp() {
  			this.gamesocket.emit('moveRightUp');
  		},
  		paddleRightDown() {
  			this.gamesocket.emit('moveRightDown');
  		},
  	}
  })
</script>

<style scoped>

.queue {
	padding-top: 100px;
	font-size: 20px;
	text-align: center;
}

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
