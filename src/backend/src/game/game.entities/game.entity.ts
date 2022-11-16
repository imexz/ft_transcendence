import { Ball } from "./ball.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import User from "src/users/entitys/user.entity";
import { GameSetup } from "./setup.entity";
import { Paddle } from "./paddle.entity";
import { Score } from "./score.entity";
import { Exclude } from 'class-transformer';
import { GameData } from "./gameData";
import { Settings } from "./settings";


export enum Side{
	left,
	right
}


@Entity()
export class Game extends GameData{

	@Exclude()
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.winns)
	winner: User;

	@ManyToOne(() => User, (user) => user.loses)
	loser: User;
	
	@Exclude()
	interval: number | null = null;

	@Exclude()
	spectators: Array<number> = [];

	@Column()
	scoreWinner: number = 0;
	@Column()
	scoreLoser: number = 0;

	@Exclude()
	isCustomized: boolean = false;

	constructor(gameid: number, gsetup: GameSetup, isCustomized: boolean = false, settings: Settings) {
		super(gsetup, settings);
		this.id = gameid;
		this.isCustomized = isCustomized;
	}
}
