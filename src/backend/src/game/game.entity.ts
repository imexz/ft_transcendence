import { User } from "src/users/entitys/user.entity";
import { OneToOne, Entity, ManyToMany, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class game{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User, (User) => User.games)
    palyer: User[];

    @OneToOne(() => User, {onDelete: "SET NULL"})
    winner: User;

    @Column()
    score1: number;

    @Column()
    score2: number;
    
}