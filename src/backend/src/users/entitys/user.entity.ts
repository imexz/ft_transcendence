import { chatroom } from "../../chatroom/chatroom.entity";
import { message } from "../../message/message.entity";
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, PrimaryColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { fileEntity } from "../../avatar/file.entitys";
import { Exclude } from 'class-transformer';
import { game } from "src/game/game.entity";


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
	id: number;

	@Column({unique: true})
	unique_name: string;

	@Column()
	avatar_url: string;

	@Column()
	@Exclude()
	avatar_url_42intra: string;

	@ManyToOne(() => chatroom, (chatroom) => chatroom.owner)
    owner_of: chatroom[];

	@OneToOne(() => fileEntity, (avatar) => avatar.user) //{ onDelete: 'CASCADE' }
	@JoinColumn()
	avatar :fileEntity;

	@ManyToMany(() => User)
	@JoinTable({ joinColumn: { name: 'users_id_1' } })
	friends: User[];

	@Column({nullable: true})
	current_status: number;

	@OneToMany(() => message, (message) => message.user)
	messeges: message[];

	@ManyToMany(() => chatroom, (chatroom) => chatroom.Users)
	@JoinTable()
	chatrooms: chatroom[];

	@ManyToMany(() => chatroom, (chatroom) => chatroom.admins)
	@JoinTable()
	admin_of: chatroom[];

	@Exclude()
	@Column({nullable: true})//maye wrong {unique: true}
	clientId: string;

	@OneToOne(() => game, (game) => game.palyer)
	games: game[];



}