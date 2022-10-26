import { chatroom } from "../chatroom/chatroom.entity";
import User from "../users/entitys/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => User, (user) => user.messeges) //TB typo?
    user: User;

    @ManyToOne(() => chatroom, (chatroom) => chatroom.messages, {onDelete: 'CASCADE'} )
    chatroom: chatroom;

}