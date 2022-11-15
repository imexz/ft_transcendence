import chatroom from "../../chatroom/chatroom.entity";
import { message } from "../../message/message.entity";
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany, OneToOne, PrimaryColumn, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { fileEntity } from "../../avatar/file.entitys";
import { Exclude } from 'class-transformer';
import { Game } from '../../game/game.entities/game.entity';
import { Friend } from "../friends/friend.entity";
import { UserStatus } from "./status.enum";
import { banMute } from "src/chatroom/banMute/banMute.entity";



@Entity()
export default class User {
	// constructor(id: number, unique_name: string, avatar_url_42intra: string, avatar: fileEntity, friends: User[]){
	// 	this.id = id
	// 	this.unique_name = unique_name
	// 	this.avatar_url = avatar_url_42intra
	// 	this.avatar_url_42intra = avatar_url_42intra
	// 	this.avatar = avatar
	// 	this.friends = friends
	// }


	constructor(partial: Partial<User>) {
		Object.assign(this, partial);
	  }

	@PrimaryColumn({unique: true})
	id: number;

	// @Column()
	@Column({unique: true}) //finall
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

	// @ManyToMany(() => Game, (game) => game.player)
	// @JoinTable()
	// games?: Game[];

	@OneToMany(() => Game, (game) => game.winner)
	winns?: Game[]


	@OneToMany(() => Game, (game) => game.loser)
	loses?: Game[]

	@Exclude()
	@Column({ nullable: true })
  	twoFactorAuthenticationSecret?: string;

	// @Exclude()
	@Column({ default: false })
	isTwoFactorAuthenticationEnabled: boolean;

	// @ManyToMany(() => User, user => user.receivedRequests)
	// @JoinTable({joinColumn: {name: 'senderId'}})
	// sendRequest?: User[];

	// @ManyToMany(() => User, user => user.sendRequest)
	// receivedRequests?: User[];

	@ManyToMany(() => User, user => user.blocked_me)
	@JoinTable({joinColumn: {name: 'senderId'}})
	blocked?: User[];

	@ManyToMany(() => User, user => user.blocked)
	blocked_me?: User[];

}
