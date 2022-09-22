import { User } from "../users/entitys/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { message } from "../message/message.entity";

@Entity()
export class chatroom{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne(() => User, (User) => User.owner_of)
    owner: User;

    @ManyToMany(() => User, (User) => User.admin_of)
    admins: User[];

    @ManyToMany(() => User, (User) => User.chatrooms)
    Users: User[];

    @OneToMany(() => message, (message) => message.chatroom)
    @JoinTable()
    messages: message[];


}