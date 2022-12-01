
import { Ball } from "./ball.entity";
import { Paddle } from "./paddle.entity";
import { Score } from "./score.entity";
import { Exclude } from 'class-transformer';
import { Serving, Settings } from "./settings";
import { Side } from "./game.entity";

export class GameData {

    constructor(settings: Settings) {
        if (settings) {
            this.settings = settings
            this.ball = new Ball(settings.enableSlowServe, settings.serving)
        } else {
            this.ball = new Ball(false, Serving.RANDOM)
        }
    }
	@Exclude()
	ball: Ball
	@Exclude()
	paddleLeft = new Paddle(Side.left)
	@Exclude()
	paddleRight = new Paddle(Side.right)
	@Exclude()
	score = new Score()
    @Exclude()
    settings: Settings

}