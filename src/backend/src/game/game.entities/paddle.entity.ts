import { PosXY } from "../game.interfaces/pos.interface";
import { Side } from "./game.entity";
import { GameSetup } from "./setup.entity";
export class Paddle {
	constructor (side: Side){
		this.side = side
		this.position = side == Side.left? {x: 10, y: 210} : {x: 610, y: 210}
		this.reboundAngles = side == Side.left ? [-45, -30, -15, 0, 0, 15, 30, 45] : [-135, -150, -165, 180, 180, 165, 150, 135]
	}
	width: number = GameSetup.paddleWidth;
	height: number = GameSetup.paddleHeight;
	position: PosXY;
	speed: number = GameSetup.paddleSpeed;
	reboundAngles: Array<number> ;
	side: Side;
	// socketid: string;

	reset(wight?: number, height?: number, speed?: number){
		if (wight && height && speed) {
			this.width = wight
			this.height = height
			this.speed = speed
			
		} else {
			this.width = GameSetup.paddleWidth
			this.height = GameSetup.paddleHeight
			this.speed = GameSetup.paddleSpeed
		}
	}
}
