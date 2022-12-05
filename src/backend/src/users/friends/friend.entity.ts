import { message } from "src/message/message.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import User from "../entitys/user.entity";


export enum Status {
	requsted = 1,
	accepted,
	denied,
	pending
}

@Entity()
export class Friend {
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
