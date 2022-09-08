import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, PrimaryColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { file } from "../../avatar/file.entitys";


@Entity()
export class User {
	constructor(id: number, unique_name: string, avatar_url: string, friends: User[]){
		this.id = id
		this.unique_name = unique_name
		this.avatar_url = avatar_url
		this.friends = friends
	} 
	@PrimaryColumn({unique: true})
	id: number;

	@Column({unique: true})
	unique_name: string;

	@Column()
	avatar_url: string;

	@ManyToMany(() => User)
	@JoinTable({ joinColumn: { name: 'users_id_1' } })
	friends: User[];

	@Column({nullable: true})
	current_status: number;
}