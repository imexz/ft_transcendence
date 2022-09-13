import { Injectable } from '@nestjs/common';
import { GameObj } from './game.interfaces/gameobj.interface';
import { BallObj } from './game.interfaces/ballobj.interface';
import { PaddleObj } from './game.interfaces/paddleobj.interface';
import { PosXY } from './game.interfaces/pos.interface';
import { ScoreObj } from './game.interfaces/scoreobj.interface';

@Injectable()
export class GameService {
	ball: BallObj = {
		radius: 10,
		position: {
			x: 200,
			y: 200,
		},
		direction: {
			x: 1,
			y: 1,
			speed: 1.5,
		}
	}
	paddleLeft: PaddleObj = {
		width: 20,
		height: 60,
		position: {
			x: 10,
			y: 210,
		}
	}
	paddleRight: PaddleObj = {
		width: 20,
		height: 60,
		position: {
			x: 650,
			y: 210,
		}
	}
	score: ScoreObj = {
		scoreLeft: 0,
		scoreRight: 0,
	}

	getData(): GameObj {
		this.updateData();
		if (this.checkScore())
			this.resetBall();
		return {ball: this.ball, paddleLeft: this.paddleLeft, paddleRight: this.paddleRight, score: this.score};
	}

	updateData() {
		this.ball.position.x += (this.ball.direction.speed * this.ball.direction.x);
		this.ball.position.y += (this.ball.direction.speed * this.ball.direction.y);
		if (this.ball.direction.x > 0) {
			if (this.ball.position.x + this.ball.radius >= 640) {
				this.ball.position.x = 640 - this.ball.radius;
				this.ball.direction.x *= -1;
			}
		}
		else {
			if (this.ball.position.x - this.ball.radius <= 0) {
				this.ball.position.x = 0 + this.ball.radius;
				this.ball.direction.x *= -1;
			}

		}
		if (this.ball.direction.y > 0) {
			if (this.ball.position.y + this.ball.radius >= 480) {
				this.ball.position.y = 480 - this.ball.radius;
				this.ball.direction.y *= -1;
			}
		}
		else {
			if (this.ball.position.y - this.ball.radius <= 0) {
				this.ball.position.y = 0 + this.ball.radius;
				this.ball.direction.y *= -1;
			}
		}
	}

	checkScore(): boolean {
		var ret: boolean = false;
		if (this.ball.position.x - this.ball.radius <= 0) {
			this.increaseScoreRight();
			ret = true;
		}
		else if (this.ball.position.x + this.ball.radius >= 640 ) {
			this.increaseScoreLeft();
			ret = true;
		}
		return ret;
	}

	resetBall() {
		var y: number = Math.random();
		var x: number = 1;
		while (y == 0)
			y = Math.random();
		var zy: number = Math.random() * 2;
		var zx: number = Math.random() * 2;
		if (zy > 1)
			y *= -1;
		if (zx > 1)
			x *= -1;

		this.ball.position.x = 340;
		this.ball.position.y = 240;
		this.ball.direction.x = x;
		this.ball.direction.y = y;
	}

	increaseScoreLeft() {
		this.score.scoreLeft += 1;
	}

	increaseScoreRight() {
		this.score.scoreRight += 1;
	}
}
