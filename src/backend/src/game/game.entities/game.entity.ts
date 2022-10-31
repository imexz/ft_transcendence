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
	interval: number | null = null;

	@Column()
	scoreLeft: number = 0;
	@Column()
	scoreRight: number = 0; 




	constructor(gameid: number, gsetup: GameSetup) {
		super(gsetup);
		this.id = gameid;
		}
}
