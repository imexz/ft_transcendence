import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from './user.entity';
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
	){}

	findAll(): Promise<User[]> {
		return this.usersRepository.find()
	}

	findOne(id: number): Promise<User> {
		return this.usersRepository.findOneBy({id})
	}

	async remove(id: number): Promise<void> {
		await this.usersRepository.delete(id);
	}

	async add(id: number, name: string): Promise<User> {
		const user = this.usersRepository.create()
		if (user) {
			user.id = id;
			user.Name = name;
			return user
		}
		return null
	}
}