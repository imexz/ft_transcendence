import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, PrimaryColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { DatabasFile } from "./databaseFile.entitys";


@Entity()
export class User {
	constructor(id: number, unique_name: string, avatar_url: string){
		this.id = id
		this.unique_name = unique_name
		this.avatar_url = avatar_url
	}
	@PrimaryColumn({unique: true})
	id: number;

	@Column({unique: true})
	unique_name: string;

	@Column()
	avatar_url: string;

	@JoinColumn({name: 'avatarId'})
	@OneToOne(
		() => DatabasFile,
		{
			nullable: true
		}
	)
	public avatar?: DatabasFile;

	@Column({nullable: true})
	public avatarId?: number;

	@ManyToMany(() => User)
	@JoinTable({ joinColumn: { name: 'users_id_1' } })
	friends: User[];

	@Column({nullable: true})
	current_status: number;
}