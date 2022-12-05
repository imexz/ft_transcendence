import { Exclude } from 'class-transformer';
import User from "src/users/entitys/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
	id: number

	@ManyToOne(() => User, (user) => user.winns)
	winner: User

	@ManyToOne(() => User, (user) => user.loses)
	loser: User
	
	@Exclude()
	interval: number | null = null

	@Exclude()
	spectators: Array<number> = []

	@Column()
	scoreWinner: number = 0
	@Column()
	scoreLoser: number = 0

	constructor(gameid: number, settings: Settings) {
		super(settings)
		this.id = gameid
	}
}
