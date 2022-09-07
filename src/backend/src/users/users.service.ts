import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from './entitys/user.entity';
import { Repository } from "typeorm";
import { DatabasFile } from "./entitys/databaseFile.entitys";
import e from "express";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(DatabasFile)
		private DatabasFileRepository: Repository<DatabasFile>,
	){}

	async findAll(): Promise<User[]> {
		console.log("findAll");
		const user = await this.usersRepository.find();
		console.log(user);
		
		return user
	}

	findOne(id: number): Promise<User> {
			console.log("test");

			const user = this.usersRepository.findOneBy({id: id})
			console.log("test1");
			return user
	
	}

	async remove(id: number): Promise<void> {
		await this.usersRepository.delete(id);
	}

	async addUser(user: User): Promise<User> {
		const tmp = await this.usersRepository.create(user)
		if (tmp) {
			console.log(tmp)
			this.usersRepository.save(tmp)
			return tmp
		}
		return null
	}

	async addfriend(user_id: number, friend_id: number) {
		console.log(user_id);
		console.log(friend_id);
		
		if(!user_id || !friend_id) {
			console.log("freind or user null");
			
			return null
		}
		try{
			const user = this.findOne(user_id);
			const user_friend = this.findOne(friend_id);
			console.log(((await user).friends));
			console.log((await user));
			console.log((await user_friend));

			
			(await user).friends.fill(await user_friend);
			// (await user).friends = user_friend;
			// (await user).friends.fill(await user_friend)
			this.usersRepository.update((await user).id, await user);
		} catch(exception: unknown) {
			console.log(exception)
			console.log("freind or user null");
			return null;
		}
		return;

		// if(await user == null || await user_friend == null) {

		// }

	}
}