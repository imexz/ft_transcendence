import { InjectRepository } from "@nestjs/typeorm";
import { Not } from "typeorm"
import User from './entitys/user.entity';
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";
import { fileEntity } from "../avatar/file.entitys"
import { hostURL } from "../hostURL";
import { FriendsService } from "./friends/friends.service";
import { UserStatus } from "./entitys/status.enum";

@Injectable()
export class UsersService {
	async getTopPlayer() {
		const test = await this.usersRepository.createQueryBuilder("user")
			.loadRelationCountAndMap('user.winns','user.winns')
			.loadRelationCountAndMap('user.loses','user.loses')
			// .orderBy("winns", "DESC")
			// .limit(10)
			.getMany()

		console.log("getTopPlayer", test);

		return test
	}

	async setStatus(id: number , userStatus: UserStatus) {
		this.usersRepository.update(id, {userStatus: userStatus})
	}

	async getFriends(id: any) {

		const friends = await this.usersRepository.findOne({where:{
			id: id
		},
		relations:{
			myFriends: true
		}})
		// console.log(friends);
		return(friends.myFriends)
	}


    async addClientId(id: number, clientId: string) {
		const user = await this.usersRepository.findOneBy({id: id})
		this.usersRepository.update(id, user)
		return user.username;
    }
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
		){}


	async findAll(id: number): Promise<User[]> {
		// console.log("findAll");
		const users = await this.usersRepository.find({ where: {id: Not(id)}});
		// console.log(user);
		return users
	}

	async getUser(id: number): Promise<User> {
		// console.log("getUser -> ", id);

		if(id !== undefined && id != NaN) {
			const user = await this.usersRepository.findOne({where: {id: id}})
			// console.log("getUsers: ", user);

			return user
		}
		// console.log("getUser returns undefined");

		return undefined
	}


	async getUserSocket(server, id: number){
		console.log("id = ", id);

		const sockets = await server.fetchSockets();

		for (const socket of sockets) {
			console.log("socket ", socket.handshake.auth);
            if(socket.handshake.auth.id == id)
            {
				console.log("found socket");

              return socket
            }
			console.log(socket.handshake.auth.id);

        }
	}


	async remove(id: number): Promise<void> {
		await this.usersRepository.delete(id);
	}

	async addUser(user: User): Promise<User> {

		if(user.avatar_url == null)
		{
			user.avatar_url = "https://cdn.intra.42.fr/users/0f2f1b9f30116d06e1e55bed9cf2cb46/casian.png"
		}
		if(user.avatar_url_42intra == null)
		{
			user.avatar_url_42intra = "https://cdn.intra.42.fr/users/0f2f1b9f30116d06e1e55bed9cf2cb46/casian.png"
		}
		var tmp: User = undefined
		tmp = this.usersRepository.create(user);
		var faild: boolean = false
		var counter: number = 0

		do {
			try {
				tmp = await this.usersRepository.save(tmp);
				faild = false
				console.log("try block ende");

			}
			catch (error) {
				console.log("fehler in init user");
				if (tmp.username != undefined)
				{
					tmp.username += "💩"
					faild = true
					++counter
				}
			}

		} while (faild && counter < 40);

		console.log(tmp.username);

		return tmp
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
			user.avatar_url = hostURL + ":3000/avatar/" + id.toString()
		}
		this.usersRepository.update(id, user)
	}

	async updateName(user: User, username: string)
	{
		// const user = await this.usersRepository.findOneBy({id: id})
		// if (user == null)
		// {
		// 	return
		// }
		// user.username = username
		username = username.trim()
		if (username.length < 1 || username.length > 30)
			throw new HttpException('provide username 1-30 characters', HttpStatus.BAD_REQUEST)
		user.username = username
		try {
			await this.usersRepository.save(user)
		} catch (error) {
			console.log(error);
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}
		return
	}
	// async addfriend(user_id: number, friend_id: number) {
	// 	// console.log(user_id);
	// 	// console.log(friend_id);

	// 	if(user_id && friend_id) {
	// 		try{
	// 			const user = await this.usersRepository.findOne({
	// 				where: {
	// 					id: user_id
	// 				},
	// 				relations: {
	// 					friends: true,
	// 				}
	// 			});
	// 			const user_friend: User = await this.usersRepository.findOneBy({id: friend_id});

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
