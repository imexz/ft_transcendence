import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import User from "../users/entitys/user.entity";

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