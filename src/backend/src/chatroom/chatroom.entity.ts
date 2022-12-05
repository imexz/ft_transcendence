import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { message } from "../message/message.entity";
import User from "../users/entitys/user.entity";
import { banMute } from "./banMute/banMute.entity";

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

    @OneToMany(() => banMute, (banMute) => banMute.chatroom)
    muted: banMute[];


    @ManyToMany(() => User, (User) => User.chatrooms)
    users: User[];

    @ManyToMany(() => User)
    @JoinTable()
    bannedUsers: User[];

    @OneToMany(() => message, (message) => message.chatroom)
    @JoinColumn()
    messages: message[];

    @Column()
    access: Access;

    @Exclude()
    @Column({nullable: true})
    hash: string
}