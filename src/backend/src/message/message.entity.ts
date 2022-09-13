import { chatroom } from "../chatroom/chatroom.entity";
import { User } from "../users/entitys/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class message {

    @CreateDateColumn()
    @PrimaryColumn()
    timestamp: Date;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.messeges)
    user: User;

    @ManyToOne(() => chatroom, (chatroom) => chatroom.messages )
    chatroom: chatroom;
    
}