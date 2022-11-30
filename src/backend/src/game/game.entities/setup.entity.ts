import { PosXY } from "../game.interfaces/pos.interface";

export class GameSetup {
	static staticballPos: PosXY = {x: 340, y: 240}
	static ballRadius: number = 10
	static ballSpeed: number = 2
	static paddleWidth: number = 20
	static paddleHeight: number = 100
	static paddleSpeed: number = 10
	static scoreIncrease: number = 1
}
