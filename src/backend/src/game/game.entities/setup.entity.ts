import { PosXY } from "../game.interfaces/pos.interface";
import { BallDirObj } from "../game.interfaces/balldirobj.interface";

export enum Serving {
	LAST_SCORED,
	ALTERNATE,
	RANDOM
}

export class GameSetup {
	constructor(scoreToWin: number = 10, enablePowerUp: boolean = false, enableSlowServe: boolean = false, serving: Serving = Serving.RANDOM) {
		this.scoreToWin = scoreToWin;
		this.enablePowerUp = enablePowerUp;
		this.enableSlowServe = enableSlowServe;
		this.serving = serving;
	}
	ballPos: PosXY = {x: 340, y: 240};
	ballRadius: number = 10;
	ballSpeed: number = 0.25;
	angle: number = Math.random() * 2 * Math.PI;
	ballDir: BallDirObj = {
		angle: this.angle,
		speed: this.ballSpeed,
		x: this.ballSpeed * Math.cos(this.angle),
		y: this.ballSpeed * Math.sin(this.angle),
	};
	paddleWidth: number = 20;
	paddleHeight: number = 100;
	paddleSpeed: number = 10;
	scoreIncrease: number = 1;
	scoreToWin: number;
	enablePowerUp: boolean;
	enableSlowServe: boolean;
	serving: Serving;
}
