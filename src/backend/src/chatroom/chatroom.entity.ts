import { User } from "../users/entitys/user.entity";
import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { message } from "src/message/message.entity";

@Entity()
export class chatroom{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => User, (User) => User.chatrooms)
    admins: User[];

    @ManyToMany(() => User, (User) => User.chatrooms)
    Users: User[];

    @ManyToMany(() => message, (message) => message.chatroom)
    messages: message[];


}