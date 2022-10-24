import { message } from "src/message/message.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "../entitys/user.entity";


export enum Status {
	requsted,
	accepted,
	denide
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

	@ManyToOne(() => User, (user)=> user.friendsOfMe)
	public requester: User

	@ManyToOne(() => User, (user)=> user.myFriends)
	public accepter: User

	@OneToMany(() => message, (message) => message.chatroom)
    messages: message[];
	
}
