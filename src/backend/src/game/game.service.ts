import { Injectable } from '@nestjs/common';
import { GameObj } from './game.interfaces/gameobj.interface';
import { BallObj } from './game.interfaces/ballobj.interface';
import { PaddleObj } from './game.interfaces/paddleobj.interface';
import { ScoreObj } from './game.interfaces/scoreobj.interface';
import { SetupObj } from './game.interfaces/setupobj.interface';

@Injectable()
export class GameService {
	setup: SetupObj = {
		ballPos: {
			x: 340,
			y: 240,
		},
		ballRadius: 40,
		ballSpeed: 1,
		ballDir: {
			x: 1,
			y: 1,
		},
		paddleWidth: 20,
		paddleHeight: 100,
		paddleSpeed: 10,
		scoreIncrease: 1,
	}
	ball: BallObj = {
		radius: this.setup.ballRadius,
		position: {
			x: this.setup.ballPos.x,
			y: this.setup.ballPos.y,
		},
		direction: {
			angle: Math.random() * 2 * Math.PI,
			speed: this.setup.ballSpeed,
			x: this.setup.ballDir.x,
			y: this.setup.ballDir.y,
		}
	}
	paddleLeft: PaddleObj = {
		width: this.setup.paddleWidth,
		height: this.setup.paddleHeight,
		position: {
			x: 10,
			y: 210,
		},
		speed: this.setup.paddleSpeed,
		reboundAngles:  [-45, -30, -15, 0, 0, 15, 30, 45],
		id: "left",
	}
	paddleRight: PaddleObj = {
		width: this.setup.paddleWidth,
		height: this.setup.paddleHeight,
		position: {
			x: 610,
			y: 210,
		},
		speed: this.setup.paddleSpeed,
		reboundAngles: [-135, -150, -165, 180, 180, 165, 150, 135],
		id: "right",
	}
	score: ScoreObj = {
		scoreLeft: 0,
		scoreRight: 0,
		increaseLeft: 1,
		increaseRight: 1,
	}

	getData(): GameObj {
		this.updateData();
		this.collisionControl();
		if (this.scored()){
			this.reset();
		}
		return {ball: this.ball, paddleLeft: this.paddleLeft, paddleRight: this.paddleRight, score: this.score};
	}

	updateData() {
		this.ball.position.x += this.ball.direction.x;
		this.ball.position.y += this.ball.direction.y;
		// if (this.ball.direction.x > 0) {
		// 	if (this.ball.position.x + this.ball.radius >= 640) {
		// 		this.ball.position.x = 640 - this.ball.radius;
		// 		this.ball.direction.x *= -1;
		// 	}
		// }
		// else {
		// 	if (this.ball.position.x - this.ball.radius <= 0) {
		// 		this.ball.position.x = 0 + this.ball.radius;
		// 		this.ball.direction.x *= -1;
		// 	}

		// }
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

	isBallWithinPaddleRange(paddle: PaddleObj): boolean {
		return (this.ball.position.y >= paddle.position.y &&
			this.ball.position.y <= paddle.position.y + paddle.height)
	}

	isBallAtPaddle(paddle: PaddleObj): boolean {
		let ret: boolean = false;
		if (paddle.id == "left") {
			ret = this.ball.position.x - this.ball.radius <= paddle.position.x + paddle.width;
		} else if (paddle.id == "right") {
			ret = this.ball.position.x + this.ball.radius >= paddle.position.x;
		}
		return ret;
	}

	calcAngle(paddle: PaddleObj) {
		var section: number;

		section = paddle.height / 8;
		if (this.isBallWithinPaddleRange(paddle)) {
			var i: number = 1;
			while (this.ball.position.y > (paddle.position.y + i * section)) {
				i++;
			}
			this.ball.direction.angle = paddle.reboundAngles[i - 1];
		}
	}

	updateBallDirection(paddle: PaddleObj) {
		this.calcAngle(paddle);
		this.ball.direction.x = this.ball.direction.speed * Math.cos(this.ball.direction.angle * (Math.PI / 180));
		this.ball.direction.y = this.ball.direction.speed * Math.sin(this.ball.direction.angle * (Math.PI / 180));
	}

	collisionControl() {
		if (this.ball.direction.x > 0) {
			if (this.isBallAtPaddle(this.paddleRight) &&
				this.isBallWithinPaddleRange(this.paddleRight)) {
					this.updateBallDirection(this.paddleRight);
			}
		}
		else {
			if (this.isBallAtPaddle(this.paddleLeft) &&
				this.isBallWithinPaddleRange(this.paddleLeft)) {
					this.updateBallDirection(this.paddleLeft);
			}
		}
	}

	scored(): boolean {
		var ret: boolean = false;
		if (this.ball.position.x - this.ball.radius <= 0) {
			this.score.scoreRight += this.score.increaseRight;
			ret = true;
		}
		else if (this.ball.position.x + this.ball.radius >= 640 ) {
			this.score.scoreLeft += this.score.increaseLeft;
			ret = true;
		}
		return ret;
	}

	reset() {
		this.ball.position.x = this.setup.ballPos.x;
		this.ball.position.y = this.setup.ballPos.y;
		this.ball.direction.speed = this.setup.ballSpeed;
		this.ball.direction.angle = Math.random() * 2 * Math.PI;
		this.ball.direction.x = this.ball.direction.speed * Math.cos(this.ball.direction.angle);
		this.ball.direction.y = this.ball.direction.speed * Math.sin(this.ball.direction.angle); // * 0.1
		this.ball.radius = this.setup.ballRadius;

		this.paddleLeft.width = this.setup.paddleWidth;
		this.paddleLeft.height = this.setup.paddleHeight;
		this.paddleLeft.speed = this.setup.paddleSpeed;
		this.paddleRight.width = this.setup.paddleWidth;
		this.paddleRight.height = this.setup.paddleHeight;
		this.paddleRight.speed = this.setup.paddleSpeed;

		this.score.increaseLeft = this.setup.scoreIncrease;
		this.score.increaseRight = this.setup.scoreIncrease;


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
