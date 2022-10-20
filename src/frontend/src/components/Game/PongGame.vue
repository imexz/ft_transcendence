<template>
  <div v-show="gameExists">
    <div class="matchInfo">
      <div id = "scoreLeft">
        <UserSummary :user=userLeft!></UserSummary>
      </div>
      <div>
        vs
      </div>
      <div id = "scoreRight">
        <UserSummary :user=userRight!></UserSummary> 
      </div>
    </div>
    <div class="gameCanvas">
      <canvas id="pixi"></canvas>
    </div>
    <div v-show="!side" class="leaveGame">
      <button @click="leaveGame"> Leave </button>
    </div>
	</div>
	<div class="queue" v-show="!gameExists">
		Waiting for a match...
	</div>
</template>

<script lang="ts">
  import { io, Socket } from "socket.io-client";
  import { API_URL } from '@/defines';
  import { defineComponent } from 'vue';
  import * as PIXI from 'pixi.js';
  import UserSummary from '@/components/Profile/UserSummary.vue'
  import VueAxios from 'axios';
  import User from '@/models/user';

  export default defineComponent({
  	data () {
  		return {
        gameExists: false as boolean,
  		  gamesocket: null as Socket,
  		  context: null as any,
  		  side: "" as string,
			  leftScore: 0 as number,
			  rightScore: 0 as number,
        userLeft: null as User | null,
        userRight: null as User | null,
			  finished: false as boolean,
        fps: 0,
        pixiApp: null,
        pixiScene: null,
        pixiScore: {
          left: null,
          right: null,
        },
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
          bgColor: 0x060317,
          fgColor: 0x60fa31,
        }
  		}
  	},
  	components: {
      UserSummary,
  	},
    props: {
      gameExists: Boolean,
    },
  	created() { // always called when Component is initialized (e.g. on refresh)
  		// console.log("in created");
  		this.gamesocket = io(API_URL + '/game', {
  			auth: (cb: any) => {
  				cb ({id: document.cookie })
  			}
  		});
  		this.gamesocket.on('gameInfo', (data: any) => {
  			// console.log("event gameInfo received");
        // console.log(data);
        this.gameExists = true;
  			this.side = data.side;
			  this.finished = false;
        this.setUserSummary(data);
			  document.addEventListener('keydown', this.keyEvents, false);
		  });
		  this.gamesocket.emit('checkGame', (res: boolean) => {
  			if (!res) {
  				// console.log("calling checkQueue");
  				this.gamesocket.emit('checkQueue');
  			}
  		});
  		// console.log("leaving created");
  	},
  	mounted() {
      // console.log("in mounted");
      this.initPixi();
      //this is starting the drawing loop (rendering @60fps)
      this.pixiApp.ticker.add(this.updatePixi)
  		// console.log("leaving mounted");
  	},
		beforeUpdate() {
			// console.log("in beforeUpdate");
			if (this.gameExists) {
				this.gamesocket.on('updateGame', this.updateData)
		  }
		// console.log("leaving beforeUpdate");

	},

  	beforeDestory() {
  		console.log("in beforeDestroy");
  		// delete this.eventSource;
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

        this.pixiScore.left = new PIXI.Text()
        this.pixiApp.stage.addChild(this.pixiScore.left)

        this.pixiScore.right = new PIXI.Text()
        this.pixiApp.stage.addChild(this.pixiScore.right)

      },
      updatePixi(){
        this.pixiScene.clear();

        this.pixiScene.lineStyle(2, this.styleData.fgColor)

        //top whisker
        this.pixiScene.moveTo(this.pixiApp.renderer.width/2 - 10, 1)
        this.pixiScene.lineTo(this.pixiApp.renderer.width/2 + 10, 1)

        //bottom whisker
        this.pixiScene.moveTo(
          this.pixiApp.renderer.width/2 - 10,
          this.pixiApp.renderer.height - 1)
        this.pixiScene.lineTo(
          this.pixiApp.renderer.width/2 + 10,
          this.pixiApp.renderer.height - 1)

        //center line
        this.pixiScene.moveTo(this.pixiApp.renderer.width/2, 0)
        this.pixiScene.lineTo(this.pixiApp.renderer.width/2, this.pixiApp.renderer.height)

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
        this.pixiScene.beginFill(this.styleData.bgColor)
        this.pixiScene.drawCircle(
          this.gameData.ball.position.x,
          this.gameData.ball.position.y,
          this.gameData.ball.radius
        )
        this.pixiScene.endFill()

        //score
        this.pixiScore.left.text = this.leftScore;
        this.pixiScore.left.style = {
          fill: this.styleData.fgColor,
          fontFamily: 'Arial',
          fontSize: 60,
          align: 'center',
        };
        this.pixiScore.left.x =
          this.pixiApp.renderer.width/4 - this.pixiScore.left.width/2;
        this.pixiScore.left.y = 5;

        this.pixiScore.right.text = this.rightScore;
        this.pixiScore.right.style = {
          fill: this.styleData.fgColor,
          fontFamily: 'Arial',
          fontSize: 60,
          align: 'center',
        };
        this.pixiScore.right.x =
          this.pixiApp.renderer.width/4 * 3 - this.pixiScore.right.width/2;
        this.pixiScore.right.y = 5;
      },
      updateData(data: any) {
        //this is updating the Date-> independent of drawing loop
        // console.log("callback updateGame");
				if (data === undefined) {
          // console.log("data undefined");
          this.gameExists = false;
					this.side = "";
					this.left = 0;
					this.right = 0;
          return;
        }
				this.finished = data.finished;
				this.leftScore = data.score.scoreLeft;
				this.rightScore = data.score.scoreRight;

        // if (this.leftScore > 4 || this.rightScore > 4)
        //   this.styleData.fgColor = 0xFF0000

        // if ()

        switch(Math.max(this.leftScore, this.rightScore)) {
          case 4:
            this.styleData.fgColor = 0xf5ac0e
            break;
          case 8:
            this.styleData.fgColor = 0xe70038
            break;
        }

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
      setUserSummary(data: any) {
        console.log("setUserSummary");
        VueAxios({
          url: '/users/find/' + data.playerLeft.toString(),
          baseURL: API_URL,
          method: 'GET',
          withCredentials: true,
        })
          .then(response => { this.userLeft = response.data })
          .catch();
        VueAxios({
          url: '/users/find/' + data.playerRight.toString(),
          baseURL: API_URL,
          method: 'GET',
          withCredentials: true,
        })
          .then(response => { this.userRight = response.data })
          .catch()
      },
      leaveGame() {
        this.gamesocket.emit('leaveGame');
        this.$router.push("/");
      }
  	}
  })
</script>

<style scoped>

.queue {
	padding-top: 100px;
	font-size: 20px;
	text-align: center;
}

.matchInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 60px;
  width: 640px;
  margin: auto;
  margin-bottom: 20px;
  padding: 10px 20px 10px 20px;
  border: 2px solid var(--ft_cyan);
  border-radius: 10px;

}

.gameCanvas {
  display: inline-block;
  padding: 20px;
  border: 2px solid var(--ft_cyan);
  border-radius: 10px;

}

</style>
