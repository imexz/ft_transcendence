import { InjectRepository } from "@nestjs/typeorm";
import { User } from './entitys/user.entity';
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { fileEntity } from "../avatar/file.entitys"
import { hostURL } from "../hostURL";
import { FriendsService } from "./friends/friends.service";
import { UserStatus } from "./entitys/status.enum";

@Injectable()
export class UsersService {

	async setStatus(id: number , userStatus: UserStatus) {
		this.usersRepository.update(id, {userStatus: userStatus})
	}

	async getFriends(id: any) {

		const friends = await this.usersRepository.findOne({where:{
			_id: id
		},
		relations:{
			myFriends: true
		}})
		console.log(friends);
		return(friends.myFriends)
	}


    async addClientId(id: number, clientId: string) {
		const user = await this.usersRepository.findOneBy({_id: id})
		this.usersRepository.update(id, user)
		return user.username;
    }
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
		){}


	async findAll(): Promise<User[]> {
		// console.log("findAll");
		const user = await this.usersRepository.find();
		// console.log(user);
		return user
	}

	async getUser(id: number): Promise<User> {
		// console.log("getUser -> ", id);
		
		if(id != undefined) {
			const user = await this.usersRepository.findOne({where: {_id: id}})
			// console.log("getUsers: ", user);
			
			return user
		}
		// console.log("getUser returns undefined");
		
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
		const user = await this.usersRepository.findOneBy({_id: id})
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

	async updateName(id: number, username: string)
	{
		const user = await this.usersRepository.findOneBy({_id: id})
		if (user == null)
		{
			return
		}
		user.username = username
		return this.usersRepository.save(user)
	}

	// async addfriend(user_id: number, friend_id: number) {
	// 	// console.log(user_id);
	// 	// console.log(friend_id);

	// 	if(user_id && friend_id) {
	// 		try{
	// 			const user = await this.usersRepository.findOne({
	// 				where: {
	// 					_id: user_id
	// 				},
	// 				relations: {
	// 					friends: true,
	// 				}
	// 			});
	// 			const user_friend: User = await this.usersRepository.findOneBy({_id: friend_id});
	
	// 			user.friends.push(user_friend);
	// 			this.usersRepository.save(user);
	
	// 		} catch(exception: unknown) {
	// 			console.log(exception)
	// 			console.log("freind or user null");
	// 			return null;
	// 		}
	// 		return;
	// 	}
	// }

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		return this.usersRepository.update(userId, {
		  twoFactorAuthenticationSecret: secret
		});
	  }

	turnOnTwoFactorAuthentication(userId: number) {
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
