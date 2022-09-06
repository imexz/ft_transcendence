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

	async findAll(): Promise<User[]> {
		console.log("findAll");
		const user = await this.usersRepository.find();
		console.log(user);
		
		return user
	}

	findOne(id: number): Promise<User> {
		try {
			const user = this.usersRepository.findOneByOrFail({id})
			return user
		} catch {
			console.log("tests");
		}
	}

	async remove(id: number): Promise<void> {
		await this.usersRepository.delete(id);
	}

	async add(id: number, name: string): Promise<User> {
		const user = await this.usersRepository.create()
		if (user) {
			user.id = id;
			user.Name = name;
			console.log(user)
			this.usersRepository.save(user)
			 
			return user
		}
		return null
	}
}