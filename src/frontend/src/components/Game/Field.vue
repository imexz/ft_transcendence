<template>
      <canvas id="pixi" class="gameCanvas"></canvas>
</template>

<script lang="ts">
import User from '@/models/user';
import { defineComponent } from 'vue'
import * as PIXI from 'pixi.js';

export default defineComponent({
    data() {
        return {
        timestamp: Date,
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
    created() {
    },
    mounted() {
      this.initPixi();
      this.pixiApp.ticker.add(this.updatePixi)
      this.$store.state.socketGame.on('updateBall', this.updateBall)
      this.$store.state.socketGame.on('updatePaddle', this.updatePaddle)
      this.$store.state.socketGame.on('updateScore', this.updateScore)
    },
    unmounted() {
        this.$store.state.socketGame.off('updateBall')
        this.$store.state.socketGame.off('updatePaddle')
        this.$store.state.socketGame.off('updateScore')
    },

    methods: {
    initPixi(){
        let canvas: HTMLElement = document.getElementById('pixi')
		    console.log("initPixi");
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
      updateScore(data: any) {
        this.gameData.score = data;
        switch(Math.max(this.gameData.score.scoreLeft, this.gameData.score.scoreRight)) {
          case 4:
            this.styleData.fgColor = 0xf5ac0e
            break;
          case 8:
            this.styleData.fgColor = 0xe70038
            break;
        }
        if (this.isGameFinished()) {
          this.$emit('assignWinner', this.assignWinnerAndLoser())
          console.log("winner");
          this.$store.state.game = null
        }
      },
      updatePaddle(data: any) {
        this.gameData.paddleLeft = data.paddleLeft;
        this.gameData.paddleRight = data.paddleRight;
      },
      updateBall(data: any) {
        // console.log("ball");
        // const currentTime = Date.now()

        // const difference: number = currentTime - this.timestamp;
        // console.log(difference >  0 ? 1000 / difference : "difference 0");
        // // if (difference <= 0)
        // //   return
        
        // this.timestamp = currentTime;
        //this is updating the Date-> independent of drawing loop
        // console.log("callback updateGame");
		    if (data === undefined) {
          console.log("data undefined");
          // this.gameExists = false;
			    this.left = 0;
			    this.right = 0;
        	return;
        }
		    // this.gameData.score.scoreLeft = data.score.scoreLeft;
		    // this.gameData.score.scoreRight = data.score.scoreRight;
        // console.log(this.gameData.score.scoreLeft, this.gameData.score.scoreRight);

        this.gameData.ball = data;
        
        // this.gameData.paddleLeft = data.paddleLeft;
        // this.gameData.paddleRight = data.paddleRight;
        
      },
	    isGameFinished(): boolean {
		    return this.gameData.score.scoreLeft == 3 || this.gameData.score.scoreRight == 3
	    },
      assignWinnerAndLoser() {
        if (this.gameData.score.scoreLeft > this.gameData.score.scoreRight) {
          return { winner: this.$store.state.game.playerLeft, loser: this.$store.state.game.playerRight }
        } else {
          return { winner: this.$store.state.game.playerRight, loser: this.$store.state.game.playerLeft }
        }
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
