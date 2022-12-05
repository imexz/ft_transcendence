import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "../../users/entitys/user.entity";
import chatroom from "../chatroom.entity";


@Entity()
export class banMute{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (User) => User.banMute)
    user: User

    @ManyToOne(() => chatroom, (chatroom) => chatroom.muted)
    chatroom: chatroom

    @CreateDateColumn()
    timestamp: Date;
}