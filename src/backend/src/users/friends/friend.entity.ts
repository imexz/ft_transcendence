import { chatroom } from "../../chatroom/chatroom.entity";
import { message } from "../../message/message.entity";
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, PrimaryColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { fileEntity } from "../../avatar/file.entitys";
import { Exclude } from 'class-transformer';
import { Game } from '../../game/game.entities/game.entity';
import { User } from "../entitys/user.entity";


export enum Status {
	requsted,
	accepted
}

@Entity()
export class Friend {
	// constructor(id: number, unique_name: string, avatar_url_42intra: string, avatar: fileEntity, friends: User[]){
	// 	this.id = id
	// 	this.unique_name = unique_name
	// 	this.avatar_url = avatar_url_42intra
	// 	this.avatar_url_42intra = avatar_url_42intra
	// 	this.avatar = avatar
	// 	this.friends = friends
	// }

	constructor(partial: Partial<Friend>) {
		Object.assign(this, partial);
	  }

	@PrimaryGeneratedColumn()
	id: number;

    @Column()
    public status!: Status

	// @ManyToMany(() => User, (user) => user.friends)
	// public user!: User[]

	@ManyToOne(() => User, (user)=> user.friends)
	public requester: User

	@ManyToOne(() => User, (user)=> user.friends)
	public accepter: User
	



}
