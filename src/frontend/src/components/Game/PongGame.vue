<template>
	<div>{{ fps }} fps</div>
  <div v-show="gameId">
    <div class="scoreCounter">
      <div id = "scoreLeft">
        {{leftScore}}
      </div>
      <div id = "scoreRight">
        {{rightScore}}
      </div>
    </div>
    <div class="gameCanvas">
      <canvas id="pixi"></canvas>
    </div>
	</div>
	<div class="queue" v-show="!gameId" >
		Waiting for a match...
	</div>
</template>

<script lang="ts">
  import ScoreCounter from '@/components/Game/ScoreCounter.vue'
  import { io, Socket } from "socket.io-client";
  import { API_URL } from '@/defines';
  import { defineComponent } from 'vue';
  import * as PIXI from 'pixi.js';

  export default defineComponent({
  	data () {
  		return {
			  isFirstCall: true as boolean,
  		  gameId: "" as string,
  		  gamesocket: null as Socket,
  		  context: null as any,
  		  side: "" as string,
			  leftScore: 0 as number,
			  rightScore: 0 as number,
			  finished: false as boolean,
        pixiApp: null,
        pixiScene: null,
        fps: 0,
        gameData: {
          ball: {
            position: {
              x: 0,
              y: 0
            },
            radius: 0
          },
          paddleLeft: {
            position: {
              x: 0,
              y: 0
            },
            width: 0,
            height: 0
          },
          paddleRight: {
            position: {
              x: 0,
              y: 0
            },
            width: 0,
            height: 0
          }
        },
        styleData: {
          bgColor: 0x000000,
          fgColor: 0x00FF00,
        }
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
			document.addEventListener('keydown', this.keyEvents, false);
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
      this.initPixi();
      this.pixiApp.ticker.add(this.updatePixi)
  		console.log("leaving mounted");
  	},
		beforeUpdate() {
			// console.log("in beforeUpdate");
			if (this.gameId && this.isFirstCall) {
				this.gamesocket.on('updateGame', this.updateData)
			// this.isFirstCall = false;
		}
		// console.log("leaving beforeUpdate");

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
      initPixi(){
        let canvas: HTMLElement = document.getElementById('pixi')

        this.pixiApp = new PIXI.Application({
          width: 640,
          height: 480,
          antialias: true,
          backgroundColor: this.styleData.bgColor,
          view: canvas as HTMLCanvasElement,
          
        })
        this.pixiScene = new PIXI.Graphics()
        this.pixiApp.stage.addChild(this.pixiScene)
      },
      updatePixi(){
        this.pixiScene.clear();

        //left Paddle
        this.pixiScene.lineStyle(2, this.styleData.fgColor)
        this.pixiScene.drawRect(
          this.gameData.paddleLeft.position.x,
          this.gameData.paddleLeft.position.y,
          this.gameData.paddleLeft.width,
          this.gameData.paddleLeft.height
        )

        //right Paddle
        this.pixiScene.lineStyle(2, this.styleData.fgColor)
        this.pixiScene.drawRect(
          this.gameData.paddleRight.position.x,
          this.gameData.paddleRight.position.y,
          this.gameData.paddleRight.width,
          this.gameData.paddleRight.height
        )

        //ball
        this.pixiScene.lineStyle(2, this.styleData.fgColor)
        this.pixiScene.drawCircle(
          this.gameData.ball.position.x,
          this.gameData.ball.position.y,
          this.gameData.ball.radius
        )

        this.fps =  PIXI.Ticker.shared.FPS;
        
      },
  		drawPaddles() {
  			this.context.fillStyle = "#FFFFFF";
  			this.context.fillRect(
					this.paddleLeft.position.x,
					this.paddleLeft.position.y,
					this.paddleLeft.width,
					this.paddleLeft.height
				);
  			this.context.fillRect(
					this.paddleRight.position.x,
					this.paddleRight.position.y,
					this.paddleRight.width,
					this.paddleRight.height
				);
      },
      updateData(data: any) {
        // console.log("callback updateGame");
				if (data === undefined) {
          // console.log("data undefined");
					this.gameId = "";
					this.side = "";
					this.left = 0;
					this.right = 0;
          return;
        }
				this.finished = data.finished;
				this.leftScore = data.score.scoreLeft;
				this.rightScore = data.score.scoreRight;

        if (this.leftScore > 4 || this.rightScore > 4)
          this.styleData.fgColor = 0xFF0000

				this.gameData.ball = data.ball;
				this.gameData.paddleLeft = data.paddleLeft;
				this.gameData.paddleRight = data.paddleRight;
      },
      keyEvents(event) {
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

.scoreCounter {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 90px;
  width: 640px;
  margin: auto;

}

</style>
