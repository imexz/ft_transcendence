import { chatroom } from "../../chatroom/chatroom.entity";
import { message } from "../../message/message.entity";
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, PrimaryColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { fileEntity } from "../../avatar/file.entitys";


@Entity()
export class User {
	constructor(id: number, unique_name: string, avatar_url_42intra: string, avatar: fileEntity, friends: User[]){
		this.id = id
		this.unique_name = unique_name
		this.avatar_url = avatar_url_42intra
		this.avatar_url_42intra = avatar_url_42intra
		this.avatar = avatar
		this.friends = friends
	}
	
	@PrimaryColumn({unique: true})
	id: number;

	@Column({unique: true})
	unique_name: string;

	@Column()
	avatar_url: string;

	@Column()
	avatar_url_42intra: string;

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

	@Column({nullable: true})//maye wrong {unique: true}
	clientId: string;



}