import User from "../../users/entitys/user.entity";
import { Column, Entity, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { chatroom } from "../chatroom.entity";
import { AdminAction } from "src/users/entitys/admin.enum";



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

    @Column({
        type: "enum",
        enum: AdminAction,
        default: AdminAction.muted
    })
    type: AdminAction
}