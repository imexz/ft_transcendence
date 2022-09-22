import { InjectRepository } from "@nestjs/typeorm";
import { User } from './entitys/user.entity';
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { fileEntity } from "../avatar/file.entitys"

@Injectable()
export class UsersService {

    async addClientId(id: number, clientId: string) {
		const user = await this.usersRepository.findOneBy({id: id})
		user.clientId = clientId
		this.usersRepository.update(id, user)
		return user.unique_name;
    }
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		){}

	async getFriends(id: number) {
		const user = await this.usersRepository.findOne({
			where: {
				id: id
			},
			relations: {
				friends: true,
			}
		})
		return user.friends
	}

	async findAll(): Promise<User[]> {
		console.log("findAll");
		const user = await this.usersRepository.find();
		console.log(user);
		return user
	}

	async getUser(id: number): Promise<User> {
			// console.log(id);
			try{
				const user = await this.usersRepository.findOneBy({id: id})
				if(user == null) {
					console.log("user == null");
				}
				console.log(user);

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
		
		if(user.avatar_url == null)
		{
			user.avatar_url = "https://cdn.intra.42.fr/users/juan.jpg"
		}
		if(user.avatar_url_42intra == null)
		{
			user.avatar_url_42intra = "https://cdn.intra.42.fr/users/juan.jpg"
		}
		const tmp = this.usersRepository.create(user);
		return this.usersRepository.save(tmp);

	}

	async updateAvatar(id: number, file: fileEntity) {
		const user = await this.usersRepository.findOneBy({id: id})
		if (user == null) {
			return
		}
		if(file == undefined) {
			user.avatar_url = user.avatar_url_42intra;
			// user.avatar = null;
		}
		else {
			user.avatar = file
			user.avatar_url = process.env.HOST + ":3000" + "/avatar"
		}
		this.usersRepository.update(id, user)
	}

	async updateName(id: number, unique_name: string)
	{
		const user = await this.usersRepository.findOneBy({id: id})
		if (user == null)
		{
			return
		}
		user.unique_name = unique_name
		return this.usersRepository.save(user)
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

			// const tmp1: User = ({
			// 	id: user.id,
			// 	unique_name: profile.name.givenName,
			// 	avatar_url: user.avatar_url,
			// 	avatar_url_42intra: profile.image_url,
			// 	avatar: user.avatar,
			// 	friends: user.friends,
			// 	messeges: null,
			// 	chatrooms: null,
			// 	admin_of: null,
			// 	clientId: null,
			// 	current_status: null
			// 	})
			// 	new User(, user.unique_name, , , );


			// tmp.push(user_friend);
			// (await user).friends = user_friend;
			// (await user).friends.fill(await user_friend)
			this.usersRepository.save(user);
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

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		return this.usersRepository.update(userId, {
		  twoFactorAuthenticationSecret: secret
		});
	  }

	async turnOnTwoFactorAuthentication(userId: number) {
	return this.usersRepository.update(userId, {
		isTwoFactorAuthenticationEnabled: true
	});
	}
}
