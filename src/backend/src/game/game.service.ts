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
			x: 340,
			y: 240,
		},
		direction: {
			angle: Math.random() * 2 * Math.PI,
			speed: 2,
			x: 1,
			y: 1,
		}
	}
	paddleLeft: PaddleObj = {
		width: 20,
		height: 100,
		position: {
			x: 10,
			y: 210,
		},
		speed: 10,
	}
	paddleRight: PaddleObj = {
		width: 20,
		height: 100,
		position: {
			x: 610,
			y: 210,
		},
		speed: 10,
	}
	score: ScoreObj = {
		scoreLeft: 0,
		scoreRight: 0,
	}

	getData(): GameObj {
		this.updateData();
		this.collisionControll();
		if (this.checkScore()){
			this.resetBall();
		}
		return {ball: this.ball, paddleLeft: this.paddleLeft, paddleRight: this.paddleRight, score: this.score};
	}

	updateData() {
		this.ball.position.x += this.ball.direction.x;
		this.ball.position.y += this.ball.direction.y;
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

	calcAngle(paddle: PaddleObj, b: boolean) {
		var section: number;
		var arr = new Array()

		if (b) {
			arr.push(-45, -30, -15, 0, 0, 15, 30, 45);
		}
		else {
			arr.push(-135, -150, -165, 180, 180, 165, 150, 135);
		}
		section = paddle.height / 8;

		if (this.ball.position.y >= paddle.position.y &&
			this.ball.position.y <= paddle.position.y + paddle.height) {
				if (this.ball.position.y <= (paddle.position.y + section)) {
						this.ball.direction.angle = arr[0];
				}
				else if (this.ball.position.y <= (paddle.position.y + (2 * section))) {
					this.ball.direction.angle = arr[1];
				}
				else if (this.ball.position.y <= (paddle.position.y + (3 * section))) {
					this.ball.direction.angle = arr[2];
				}
				else if (this.ball.position.y <= (paddle.position.y + (4 * section))) {
					this.ball.direction.angle = arr[3];
				}
				else if (this.ball.position.y <= (paddle.position.y + (5 * section))) {
					this.ball.direction.angle = arr[4];
				}
				else if (this.ball.position.y <= (paddle.position.y + (6 * section))) {
					this.ball.direction.angle = arr[5];
				}
				else if (this.ball.position.y <= (paddle.position.y + (7 * section))) {
					this.ball.direction.angle = arr[6];
				}
				else {
					this.ball.direction.angle = arr[7];
				}
			}
	}

	collisionControll() {
		if (this.ball.direction.x > 0) {
			if ((this.ball.position.x + this.ball.radius) >= this.paddleRight.position.x &&
				this.ball.position.y >= this.paddleRight.position.y &&
				this.ball.position.y <= (this.paddleRight.position.y + this.paddleRight.height)) {
					this.calcAngle(this.paddleRight, false);
					this.ball.direction.x = this.ball.direction.speed * Math.cos(this.ball.direction.angle * (Math.PI / 180));
					this.ball.direction.y = this.ball.direction.speed * Math.sin(this.ball.direction.angle * (Math.PI / 180));
				}
		}
		else {
			if (this.ball.position.x - this.ball.radius <= this.paddleLeft.position.x + this.paddleLeft.width &&
				this.ball.position.y >= this.paddleLeft.position.y &&
				this.ball.position.y <= this.paddleLeft.position.y + this.paddleLeft.height) {
					this.calcAngle(this.paddleLeft, true);
					this.ball.direction.x = this.ball.direction.speed * Math.cos(this.ball.direction.angle * (Math.PI / 180));
					this.ball.direction.y = this.ball.direction.speed * Math.sin(this.ball.direction.angle * (Math.PI / 180));
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
		this.ball.position.x = 340;
		this.ball.position.y = 240;

		this.ball.direction.angle = Math.random() * 2 * Math.PI;
		this.ball.direction.x = this.ball.direction.speed * Math.cos(this.ball.direction.angle);
		this.ball.direction.y = this.ball.direction.speed * Math.sin(this.ball.direction.angle);
	}

	increaseScoreLeft() {
		this.score.scoreLeft += 1;
	}

	increaseScoreRight() {
		this.score.scoreRight += 1;
	}

	movePaddleUp(b: boolean) {
		if (b) {
			if (this.paddleLeft.position.y > 0)
				this.paddleLeft.position.y -= this.paddleLeft.speed;
		}
		else {
			if (this.paddleRight.position.y > 0)
				this.paddleRight.position.y -= this.paddleRight.speed;
		}
	}

	movePaddleDown(b: boolean) {
		if (b) {
			if (this.paddleLeft.position.y < (480 - this.paddleLeft.height))
			this.paddleLeft.position.y += this.paddleLeft.speed;
		}
		else {
			if (this.paddleRight.position.y < (480 - this.paddleRight.height))
			this.paddleRight.position.y += this.paddleRight.speed;
		}
	}
}
