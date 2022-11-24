import { GameSetup } from "../game.entities/setup.entity";

export class BallDirObj {
	constructor() {
		this.newBallDir()
	}
	x: number;
	y: number;
	angle: number;
	speed = GameSetup.ballSpeed;


	isDirectionValid(angle: number): boolean {
		return (angle <= Math.PI / 4 || angle >= 7 * Math.PI / 4 || (angle >= 3 * Math.PI / 4 && angle <= 5 * Math.PI / 4));
	}

	newBallDir(){
		do {
			this.angle = Math.random() * 2 * Math.PI;
		}
		while (!this.isDirectionValid(this.angle));
		this.x = GameSetup.ballSpeed * Math.cos(this.angle);
		this.y = GameSetup.ballSpeed * Math.sin(this.angle);
	}

}
