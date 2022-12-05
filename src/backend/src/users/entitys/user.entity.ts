import { Exclude } from 'class-transformer';
import { banMute } from "src/chatroom/banMute/banMute.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { fileEntity } from "../../avatar/file.entitys";
import chatroom from "../../chatroom/chatroom.entity";
import { Game } from '../../game/game.entities/game.entity';
import { message } from "../../message/message.entity";
import { Friend } from "../friends/friend.entity";
import { UserStatus } from "./status.enum";



@Entity()
export default class User {

	constructor(partial: Partial<User>) {
		Object.assign(this, partial);
	  }

	@PrimaryColumn({unique: true})
	id: number;

	@Column({unique: true})
	username: string;

	@Column()
	avatar_url: string;

	@Column()
	@Exclude()
	avatar_url_42intra: string;

	@OneToMany(() => chatroom, (chatroom) => chatroom.owner)
	@JoinColumn()
    owner_of?: chatroom[];

	@OneToMany(() => banMute, (banMute) => banMute.user)
	@JoinColumn()
    banMute?: banMute[];

	@OneToOne(() => fileEntity, (avatar) => avatar.user, {onDelete: 'SET NULL'}) //{ onDelete: 'CASCADE' }
	@JoinColumn()
	avatar?:fileEntity;

	@OneToMany(() => Friend, (friend) => friend.accepter)
	myFriends?: Friend[];

	@OneToMany(() => Friend, (friend) => friend.requester)
	friendsOfMe?: Friend[];

	friendStatus: any

	@Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.OFFLINE,
    })
	userStatus: UserStatus;

	@OneToMany(() => message, (message) => message.sender)
	messeges?: message[];

	@ManyToMany(() => chatroom, (chatroom) => chatroom.users)
	@JoinTable()
	chatrooms?: chatroom[];

	@ManyToMany(() => chatroom, (chatroom) => chatroom.admins)
	@JoinTable()
	admin_of?: chatroom[];

	@OneToMany(() => Game, (game) => game.winner)
	winns?: Game[]


	@OneToMany(() => Game, (game) => game.loser)
	loses?: Game[]

	@Exclude()
	@Column({ nullable: true })
  	twoFactorAuthenticationSecret?: string;

	@Column({ default: false })
	isTwoFactorAuthenticationEnabled: boolean;

	@ManyToMany(() => User, user => user.blocked_me)
	@JoinTable({joinColumn: {name: 'senderId'}})
	blocked?: User[];

	@ManyToMany(() => User, user => user.blocked)
	blocked_me?: User[];

}
