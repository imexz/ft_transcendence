import { Ball } from "./ball.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import User from "src/users/entitys/user.entity";
import { GameSetup } from "./setup.entity";
import { Paddle } from "./paddle.entity";
import { Score } from "./score.entity";
import { Exclude } from 'class-transformer';
import { GameData } from "./gameData";


export enum Side{
	left,
	right
}


@Entity()
export class Game extends GameData{

	@Exclude()
	@PrimaryGeneratedColumn()
	id: number;
	// @ManyToMany(() => User, (User) => User.games)
	// player: User[];

	@ManyToOne(() => User, (User) => User.gamesAsRight)
	playerRight: User;

	@ManyToOne(() => User, (User) => User.gamesAsLeft)
	playerLeft: User;

	@Exclude()
	interval: number;

	@Column()
	scoreLeft: number = 0;
	@Column()
	scoreRight: number = 0; 

	// @Exclude()
	// ball = new Ball;
	// @Exclude()
	// paddleLeft = new Paddle;
	// @Exclude()
	// paddleRight = new Paddle;
	// @Exclude()
	// score = new Score;
	// @Exclude()
	// finished: boolean = false;
	// @Exclude()
	// interval: number;
	// @Column()
	// scoreLeft: number = 0;
	// @Column()
	// scoreRight: number = 0;



	// constructor(gameid: number, p1: string, p2: string, p1s: Socket, p2s: Socket, gsetup: GameSetup) {
	constructor(gameid: number, gsetup: GameSetup) {
		super(gsetup);
		this.id = gameid;
		// console.log("in Game constructor");
		// this.playerLeft = p1;
		// this.playerRight = p2;
		
		// if (gsetup == undefined) {
		// 	console.log("gsetup undefined");
		// }
		// else {
		// }

		// console.log(gsetup);
		// this.ball.radius = gsetup.ballRadius;
		// this.ball.position = gsetup.ballPos;
		// this.ball.direction = gsetup.ballDir;

		// this.paddleLeft.id = "left";
		// this.paddleLeft.width = gsetup.paddleWidth;
		// this.paddleLeft.height = gsetup.paddleHeight;
		// this.paddleLeft.position = {x: 10, y: 210};
		// this.paddleLeft.speed = gsetup.paddleSpeed;
		// this.paddleLeft.reboundAngles = [-45, -30, -15, 0, 0, 15, 30, 45];

		// this.paddleRight.id = "right";
		// this.paddleRight.width = gsetup.paddleWidth;
		// this.paddleRight.height = gsetup.paddleHeight;
		// this.paddleRight.position = {x: 610, y: 210};
		// this.paddleRight.speed = gsetup.paddleSpeed;
		// this.paddleRight.reboundAngles = [-135, -150, -165, 180, 180, 165, 150, 135];

		// this.score.scoreLeft = 0;
		// this.score.scoreRight = 0;
		// this.scoreLeft = 0;
		// this.scoreRight = 0;
		// this.score.increaseLeft = gsetup.scoreIncrease;
		// this.score.increaseRight = gsetup.scoreIncrease;

		// this.finished = false;
		// console.log("leaving Game constructor");
		}
}
