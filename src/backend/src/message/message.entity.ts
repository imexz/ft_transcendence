import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import chatroom from "../chatroom/chatroom.entity";
import User from "../users/entitys/user.entity";

@Entity()
export class message {

    constructor(partial: Partial<message>) {
		Object.assign(this, partial);
	  }

    @PrimaryGeneratedColumn()
    _id: number;

    @CreateDateColumn()
    timestamp: Date;

    @Column()
    content: string;

    @ManyToOne(() => User, (sender) => sender.messeges) // TB typo?
    // @JoinColumn({name: "userId"})
    sender: User;

    @Column({ nullable: true })
    senderId: number

    @ManyToOne(() => chatroom, (chatroom) => chatroom.messages, {onDelete: 'CASCADE'} )
    chatroom: chatroom;

}