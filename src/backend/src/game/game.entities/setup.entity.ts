import { PosXY } from "../game.interfaces/pos.interface";
import { BallDirObj } from "../game.interfaces/balldirobj.interface";
import { Paddle } from "./paddle.entity";

export class GameSetup {
	static staticballPos: PosXY = {x: 340, y: 240};
	static ballRadius: number = 10;
	static ballSpeed: number = 2;
	//  angle: number = Math.random() * 2 * Math.PI;
	// ballDir: BallDirObj = {
	// 	angle: this.angle,
	// 	speed: this.ballSpeed,
	// 	x: this.ballSpeed * Math.cos(this.angle),
	// 	y: this.ballSpeed * Math.sin(this.angle),
	// };
	static paddleWidth: number = 20;
	static paddleHeight: number = 100;
	static paddleSpeed: number = 10;
	static scoreIncrease: number = 1;
}
