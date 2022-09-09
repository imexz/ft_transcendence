import { chatroom } from "src/chatroom/chatroom.entity";
import { User } from "../users/entitys/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";

@Entity()
export class message {
    @CreateDateColumn()
    timestamp;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.messeges)
    user: User;

    @ManyToOne(() => chatroom, (chatroom) => chatroom.messages )
    chatroom: chatroom;
    
}