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
  import ScoreCounter from '../components/ScoreCounter.vue'
  import io from "socket.io-client";

  @Options({
    components: {
      ScoreCounter
    }
  })

  export default class PongGame extends Vue {
    socket:any = {}
    context:any = {}
    eventSource:any = {}
    position:any = {
      x: 0,
      y: 0
    }
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
    }

		mounted() {
			this.eventSource.onmessage = ({raw_data} : {raw_data: any}) => {
				let data = JSON.parse(raw_data);
        this.$refs.game 
				this.context = (this.$refs.game as any).getContext("2d");
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
