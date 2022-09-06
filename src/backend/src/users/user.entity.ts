import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	Name: string;

	// @Column()
	// picture: ImageBitmap;

	// @Column()
	// isActive: boolean;
}