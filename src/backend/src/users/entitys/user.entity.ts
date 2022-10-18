import { chatroom } from "../../chatroom/chatroom.entity";
import { message } from "../../message/message.entity";
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, PrimaryColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { fileEntity } from "../../avatar/file.entitys";
import { Exclude } from 'class-transformer';
import { Game } from '../../game/game.entities/game.entity';
import { Friend } from "../friends/friend.entity";


@Entity()
export class User {
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
	_id: number;

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

	@OneToOne(() => fileEntity, (avatar) => avatar.user, {onDelete: 'SET NULL'}) //{ onDelete: 'CASCADE' }
	@JoinColumn()
	avatar?:fileEntity;

	@OneToMany(() => Friend, (friend) => friend.accepter)
	friends?: Friend[];

	@Column({nullable: true})
	current_status: number;

	@OneToMany(() => message, (message) => message.user)
	messeges?: message[];

	@ManyToMany(() => chatroom, (chatroom) => chatroom.users)
	@JoinTable()
	chatrooms?: chatroom[];

	@ManyToMany(() => chatroom, (chatroom) => chatroom.admins)
	@JoinTable()
	admin_of?: chatroom[];

	@ManyToMany(() => Game, (game) => game.player)
	@JoinTable()
	games?: Game[];

	@Column({ nullable: true })
  	twoFactorAuthenticationSecret?: string;

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
