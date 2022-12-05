import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import User from '../entitys/user.entity';
import { UsersService } from '../users.service';
import { Friend, Status } from './friend.entity';


interface friend {
	status: number;
	senderId: number;
	avatar_url: string;
	username: string;
}

@Injectable()
export class FriendsService {
	constructor(
	@InjectRepository(Friend)
	private friendRepository: Repository<Friend>,
	private readonly usersService: UsersService){}


	async getFriendst(user_id: number) {
		const test = await this.friendRepository.find({
			relations: {
				requester: true,
				accepter: true
			},
			where: [
				{requester:{ id: user_id }, status: Not(Status.denied)},
				{accepter:{	id: user_id }, status: Not(Status.denied)},
			]
		})

		var tmp: User[] = [];
		test.forEach(element => {
			if(element.requester.id == user_id) {
				if (element.status == Status.requsted)
					element.accepter.friendStatus = Status.pending
				// if(element.status != Status.accepted)
				tmp.push(element.accepter)
			} else {
				element.requester.friendStatus = element.status
				tmp.push(element.requester)
			}
		});
		return tmp
	}


	// async getFriends(user_id: number) {

	// 	const requested: friend[] = await this.getRequestedFriends(user_id)
	// 	const accepted: friend[] = await this.getAskedFriends(user_id)
	// 	console.log("accepted");
	// 	console.log(requested.concat(accepted));
	// 	return(requested.concat(accepted))
	// }

	async removeFriendship(user_id: any, friend_id: number) {
		//console.log(("removeFriendship");
		//console.log((user_id, friend_id);

		const friendship = await this.findFriendShip(user_id, friend_id)

		//console.log((friendship);

		if(friendship != null && friendship != undefined)
			return await this.friendRepository.remove(friendship)
	}

	async findFriendShip(user_id: number, friend_id: number) {
		return await this.friendRepository.findOne({
			relations: {
				requester: true,
				accepter: true
			},
			where: [
				{requester:{ id: user_id }, accepter:{	id: friend_id }},
				{accepter:{	id: user_id }, requester:{ id: friend_id }},
			]
		})
	}


	async requestFriendship(user_id: number, friend_id: number) {
		if(user_id && friend_id) {
			const user1 = this.usersService.getUser(user_id)
			const user2 = this.usersService.getUser(friend_id)

			const friend = this.friendRepository.create({status: Status.requsted , requester: await user1, accepter: await user2})
			await this.friendRepository.save(friend)
			return friend
		}
	}

	async responseFriendship(user_id: number, friend_id: number, status: Status ) {
		if(user_id && friend_id) {
			var friendship = await this.findFriendShip(user_id, friend_id)

			if (friendship != null && friendship != undefined) {
				if (status != Status.denied)
					this.friendRepository.update(friendship.id, {status: status})
				else
					this.friendRepository.remove(friendship)
			}
		}
	}


}
