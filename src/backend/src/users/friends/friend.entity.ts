import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
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

    @Column({
        type: "enum",
        enum: Status,
        default: Status.requsted,
    })
    public status!: Status

	// @ManyToMany(() => User, (user) => user.friends)
	// public user!: User[]

	@ManyToOne(() => User, (user)=> user.friends)
	public requester: User

	@ManyToOne(() => User, (user)=> user.friends)
	public accepter: User
	
}
