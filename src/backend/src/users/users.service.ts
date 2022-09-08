import { InjectRepository } from "@nestjs/typeorm";
import { User } from './entitys/user.entity';
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	){}

	async findAll(): Promise<User[]> {
		console.log("findAll");
		const user = await this.usersRepository.find();
		console.log(user);
		
		return user
	}

	findOne(id: number): Promise<User> {
			console.log("test");
			try{
				const user = this.usersRepository.findOneByOrFail({id: id})
			return user
			} catch (err) {
				console.log("test1");
				throw err;
			}
	}

	async remove(id: number): Promise<void> {
		await this.usersRepository.delete(id);
	}

	addUser(user: User): Promise<User> {
		const tmp = this.usersRepository.create(user);
		return this.usersRepository.save(tmp);

	}

	async addfriend(user_id: number, friend_id: number) {
		console.log(user_id);
		console.log(friend_id);
		
		if(!user_id || !friend_id) {
			console.log("freind or user null");
			
			return null
		}
		try{
			const user = await this.usersRepository.findOne({
				where: {
				id: user_id
				},
				relations: {
					friends: true,
				}
			});
			const user_friend: User = await this.usersRepository.findOneBy({id: friend_id});
			// console.log((user.friends));
			// console.log((user));
			// console.log((user_friend));

			// var tmp: User[];
			// tmp = [user_friend];
			// if (user[0].friends != undefined) {
			// 	console.log("has already friends");
				
			// 	user[0].friends.forEach(element => {
			// 		tmp.push(element)
			// 	});
			// }
			// user.friends.push(user_friend);
			user.friends.push(user_friend);

			const tmp1 = new User(user.id, user.unique_name, user.avatar_url, user.friends);

			
			// tmp.push(user_friend);
			// (await user).friends = user_friend;
			// (await user).friends.fill(await user_friend)
			this.usersRepository.save(tmp1);
			// this.usersRepository.update(user.id, user);

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