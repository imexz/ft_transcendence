import User from "../users/entitys/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { message } from "../message/message.entity";
import { Exclude } from 'class-transformer';

export enum Access {
    public,
    private,
    protected,
    dm,
}

@Entity()
export default class chatroom{
    @PrimaryGeneratedColumn()
    roomId: number;

    @Column({ unique: true, nullable: true})
    roomName: string;

    @ManyToOne(() => User, (User) => User.owner_of)
    owner: User;

    @ManyToMany(() => User, (User) => User.admin_of)
    admins: User[];

    @ManyToMany(() => User, (User) => User.chatrooms)
    users: User[];

    @OneToMany(() => message, (message) => message.chatroom)
    @JoinTable()
    messages: message[];

    @Column()
    access: Access;

    @Exclude()
    @Column({nullable: true})
    hash: string

}