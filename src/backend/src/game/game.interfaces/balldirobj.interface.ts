import { Serving } from "../game.entities/settings";
import { GameSetup } from "../game.entities/setup.entity";

export class BallDirObj {
	
	constructor(slow: boolean, serving?: Serving) {
		this.slowServe = slow
		this.serving = serving
		this.newBallDir()
	}

	serving: Serving;
	side: boolean = false;
	slowServe: boolean;
	x: number;
	y: number;
	angle: number;
	speed = GameSetup.ballSpeed;


	isDirectionValid(angle: number): boolean {
		const toLeft: boolean = (angle >= 3 * Math.PI / 4 && angle <= 5 * Math.PI / 4)
		const toRight:boolean =  (angle <= Math.PI / 4 || angle >= 7 * Math.PI / 4);

		var ret: boolean;
		switch (this.serving) {
		case Serving.RANDOM:	
			ret = toLeft || toRight	
			break;
		case Serving.ALTERNATE:
			console.log("side = ", this.side);
			this.side = !this.side
			console.log("side1 = ", this.side);
			
			ret = this.side ? toLeft : toRight
			break
		case Serving.LAST_SCORED:
					
		default:
			ret = toLeft || toRight		
			break;
		}
		return ret
}

	newBallDir(){
		console.log(this.serving);
		
				do {
					this.angle = Math.random() * 2 * Math.PI;
				}
				while (!this.isDirectionValid(this.angle));
				this.x = GameSetup.ballSpeed * Math.cos(this.angle);
				this.y = GameSetup.ballSpeed * Math.sin(this.angle);
		
		if (this.slowServe) {
			this.x *= 0.5	
			this.y *= 0.5	
		}
	}

}
