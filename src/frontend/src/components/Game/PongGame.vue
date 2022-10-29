<template>
  <div v-show="gameExists">
      <GamePlayers :game="game" />
    <div class="gameCanvas">
      <canvas id="pixi"></canvas>
    </div>
    <div v-show="this.$store.state.user._id!=game?.playerRight?._id && this.$store.state.user._id!=game?.playerLeft?._id"  class="leaveGame">
      <button @click="leaveGame"> Leave </button>
    </div>
	</div>
	<div class="queue" v-show="!gameExists">
		Waiting for a match...
	</div>
</template>

<script lang="ts">
  import { Socket } from "socket.io-client";
  import { defineComponent } from 'vue';
  import * as PIXI from 'pixi.js';
  import Game from '@/models/game';
  import GamePlayers from './GamePlayers.vue'


  export default defineComponent({
  	data () {
  		return {
        gameExists: false as boolean,
  		  gamesocket: null as Socket,
        game: null as Game,
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
          },
          score: {
            scoreLeft: 0,
	          scoreRight: 0
          }
        },
        styleData: {
          bgColor: 0x060317,
          fgColor: 0x60fa31,
        }
  		}
  	},
  	components: {
      GamePlayers
    },
    props: {
      gameExists: Boolean,
    },
  	created() { // always called when Component is initialized (e.g. on refresh)
  		console.log("in created");
      // console.log(this.$store.state);
      
  		this.$store.state.socketGame.on('Game', (game: Game) => {
        console.log(game);
        this.gameExists = true
        this.asigneGame(game)
		  });
      if (this.gameExists == false) {
        this.$store.state.socketGame.emit('checkGame', (game: Game) => {
          console.log(game);
          // this.asigneGame(game)
          
        });
      }
  		// console.log("leaving created");
  	},
  	mounted() {
      // console.log("in mounted");
      this.initPixi();
      //this is starting the drawing loop (rendering @60fps)
      this.pixiApp.ticker.add(this.updatePixi)
  		// console.log("leaving mounted");
      this.$store.state.socketGame.on('updateGame', this.updateData)
  	},
		beforeUpdate() {
			// console.log("in beforeUpdate");
			// if (this.gameExists) {
		  // }
		console.log("leaving beforeUpdate");

	},
  	unmount() {
  		console.log("in unmount");
      this.$store.state.socketGame.off('Game')
      this.$store.state.socketGame.off('updateGame')
  	},
  	methods: {
      asigneGame(game: Game) {
        this.game = game
        if (game.playerRight != undefined) {
  			  document.addEventListener('keydown', this.keyEvents, false);
        }
      },
      initPixi(){
        let canvas: HTMLElement = document.getElementById('pixi')

        this.pixiApp = new PIXI.Application({
          width: 640,
          height: 480,
          antialias: false,
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
        this.pixiScore.left.text = this.gameData?.score.scoreLeft;
        this.pixiScore.left.style = {
          fill: this.styleData.fgColor,
          fontFamily: 'Arial',
          fontSize: 60,
          align: 'center',
        };
        this.pixiScore.left.x =
          this.pixiApp.renderer.width/4 - this.pixiScore.left.width/2;
        this.pixiScore.left.y = 5;

        this.pixiScore.right.text = this.gameData?.score.scoreRight;
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
          // this.gameExists = false;
					this.left = 0;
					this.right = 0;
          return;
        }
				this.finished = data.finished;
				this.gameData.score.scoreLeft = data.score.scoreLeft;
				this.gameData.score.scoreRight = data.score.scoreRight;
        console.log(this.gameData.score.scoreLeft, this.gameData.score.scoreRight);
        if (this.gameData.score.scoreLeft == 10 ||  this.gameData.score.scoreRight == 10) {
          this.gameExists = false
        }
        

        // if (this.leftScore > 4 || this.rightScore > 4)
        //   this.styleData.fgColor = 0xFF0000

        // if ()

        switch(Math.max(this.gameData.score.scoreLeft, this.gameData.score.scoreRight)) {
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
        if (!this.finished) {
          console.log(event.key);
          
          this.$store.state.socketGame.emit('key', event.key)
        }
      },
      leaveGame() {
        this.$store.state.socketGame.emit('leaveGame');
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
