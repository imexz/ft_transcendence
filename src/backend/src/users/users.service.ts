import { InjectRepository } from "@nestjs/typeorm";
import { User } from './entitys/user.entity';
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { fileEntity } from "../avatar/file.entitys"
import { hostURL } from "../hostURL";

@Injectable()
export class UsersService {


    async addClientId(id: number, clientId: string) {
		const user = await this.usersRepository.findOneBy({id: id})
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
		// console.log("findAll");
		const user = await this.usersRepository.find();
		// console.log(user);
		return user
	}

	async getUser(id: number) {
		console.log(id);
		
		if(id != undefined) {
			const user: User = await this.usersRepository.findOne({where: {id: id}})
			if(user == null) {
				console.log("user == null");
				return undefined
			}
			console.log(user);
			return user
		}
		return undefined
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
			user.avatar_url = hostURL + ":3000/avatar"
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
		// console.log(user_id);
		// console.log(friend_id);

		if(user_id && friend_id) {
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
	
				user.friends.push(user_friend);
				this.usersRepository.save(user);
	
			} catch(exception: unknown) {
				console.log(exception)
				console.log("freind or user null");
				return null;
			}
			return;
		}
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

	async turnOffTwoFactorAuthentication(userId: number) {
		return this.usersRepository.update(userId, {
			isTwoFactorAuthenticationEnabled: false
		});
	}

}
