import { PosXY } from "../game.interfaces/pos.interface";
import { BallDirObj } from "../game.interfaces/balldirobj.interface";
import { GameSetup } from "./setup.entity";

export class Ball {
	constructor(slow: boolean) {

		this.direction = new BallDirObj(slow)
	}

	
	radius: number = 10;
	position: PosXY = {x: 340, y: 240};
	direction: BallDirObj
	reset() {
		this.position = {x: 340, y: 240}
	}

	BallPostionNext() {
		// console.log("BallPostionNext", this.position);
		
		this.position.x += this.direction.x
		this.position.y += this.direction.y
		if (this.direction.y > 0) {
			if (this.position.y + this.radius >= 480) {
				this.position.y = 480 - this.radius;
				this.direction.y *= -1;
			}
		}
		else {
			if (this.position.y - this.radius <= 0) {
				this.position.y = 0 + this.radius;
				this.direction.y *= -1;
			}
		}
	}
}
