import { PosXY } from "../game.interfaces/pos.interface";
import { BallDirObj } from "../game.interfaces/balldirobj.interface";

export class GameSetup {
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
}
