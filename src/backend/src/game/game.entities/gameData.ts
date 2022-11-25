
import { Ball } from "./ball.entity";
import { Paddle } from "./paddle.entity";
import { Score } from "./score.entity";
import { Column } from "typeorm";
import { GameSetup } from "./setup.entity";
import { Exclude } from 'class-transformer';
import { Settings } from "./settings";
import { Side } from "./game.entity";

export class GameData {

    constructor(settings: Settings) {
        // console.log("gsetup undefined");
        // if (gsetup != undefined) {
        //     this.ball = new Ball()
        //     this.paddleLeft = new Paddle()
        //     this.paddleRight = new Paddle()
        //     this.score = new Score()
		
        //     this.ball.radius = gsetup.ballRadius;
        //     this.ball.position = gsetup.ballPos;
        //     this.ball.direction = gsetup.ballDir;
        
        //     this.paddleLeft.id = "left";
        //     this.paddleLeft.width = gsetup.paddleWidth;
        //     this.paddleLeft.height = gsetup.paddleHeight;
        //     this.paddleLeft.position = {x: 10, y: 210};
        //     this.paddleLeft.speed = gsetup.paddleSpeed;
        //     this.paddleLeft.reboundAngles = [-45, -30, -15, 0, 0, 15, 30, 45];
        
        //     this.paddleRight.id = "right";
        //     this.paddleRight.width = gsetup.paddleWidth;
        //     this.paddleRight.height = gsetup.paddleHeight;
        //     this.paddleRight.position = {x: 610, y: 210};
        //     this.paddleRight.speed = gsetup.paddleSpeed;
        //     this.paddleRight.reboundAngles = [-135, -150, -165, 180, 180, 165, 150, 135];
        
        //     this.score.scoreLeft = 0;
        //     this.score.scoreRight = 0;
        //     this.score.increaseLeft = gsetup.scoreIncrease;
            // this.score.increaseRight = gsetup.scoreIncrease;
        
            // this.settings = new Settings()
            // this.settings.scoreToWin = settings.scoreToWin;
            // this.settings.enablePowerUp = settings.enablePowerUp;
            // this.settings.enableSlowServe = settings.enableSlowServe;
            // this.settings.serving = settings.serving;
            if (settings) {
                this.settings = settings
                console.log("settings", this.settings);
                
                this.ball = new Ball(settings.enableSlowServe)
            } else {
                this.ball = new Ball(false)
            }

            // this.finished = false;
        // }
    }
	@Exclude()
	ball: Ball;
	@Exclude()
	paddleLeft = new Paddle(Side.left);
	@Exclude()
	paddleRight = new Paddle(Side.right);
	@Exclude()
	score = new Score();
    @Exclude()
    settings: Settings;
// @Exclude()
	// finished: boolean = false;
}