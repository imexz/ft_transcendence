import User from "../users/entitys/user.entity";
import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class fileEntity {
    @PrimaryColumn()
    public id: number;

    @Column()
    filename: string;
    
    @Column({
        type: 'bytea',
    })
    data: Uint8Array;

    @OneToOne(() => User, (user) => user.avatar, { onDelete: "CASCADE" })
    user: User;
}