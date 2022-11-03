import { Injectable } from '@nestjs/common';
import { Friend, Status } from './friend.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";
import { UsersService } from '../users.service';
import User from '../entitys/user.entity';
import { Not } from "typeorm"


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

	// async getRequestedFriends(user_id): Promise<friend[]> {
	// 	return await this.friendRepository.createQueryBuilder("friend")
	// 		.innerJoin('friend.requester', 'requester', 'requester._id = :id1', { id1: user_id })
	// 		.leftJoinAndSelect('friend.accepter', 'accepter')
	// 		.select('status, accepter._id  AS "_id", accepter.avatar_url AS avatar_url, accepter.username AS username, 1 AS me')
	// 		.getRawMany()
	// }

	// async getAskedFriends(user_id): Promise<friend[]>{
	// 	return await this.friendRepository.createQueryBuilder("friend")
	// 		.innerJoin('friend.accepter', 'accepter', 'accepter._id = :id', { id: user_id })
	// 		.leftJoinAndSelect('friend.requester', 'requester')
	// 		.select('status, requester._id  AS "_id", requester.avatar_url AS avatar_url, requester.username AS username, 0 AS me')
	// 		.getRawMany()
	// }
	
	async getFriendst(user_id: number) {
		const test = await this.friendRepository.find({
			relations: {
				requester: true,
				accepter: true
			},
			where: [
				{requester:{ _id: user_id }, status: Not(Status.denide)},
				{accepter:{	_id: user_id }, status: Not(Status.denide)},
			]
		})

		var tmp: User[] = [];	
		test.forEach(element => {
			if(element.requester._id == user_id) {
				// if(element.status != Status.accepted)
				// element.accepter.friendStatus = element.status
				tmp.push(element.accepter)
			} else {
				// if(element.status != Status.accepted)
				element.requester.friendStatus = element.status
				tmp.push(element.requester)
			}
		});
		// console.log("getFriendst");
		// console.log(tmp);
		
		return tmp
	}


	// async getFriends(user_id: number) {

	// 	const requested: friend[] = await this.getRequestedFriends(user_id)
	// 	const accepted: friend[] = await this.getAskedFriends(user_id)
	// 	console.log("accepted");
	// 	console.log(requested.concat(accepted));
	// 	return(requested.concat(accepted))
	// }

	async remove_friendship(_id: any, id: number) {
		// console.log("remove_friendship");
		// console.log(_id, id);
		
		const friends = await this.findFriendShip(_id, id)

		// console.log(friends);
		
		// const test: FindOptionsWhere<Friend> = 
		if(friends != null)
			return await this.friendRepository.remove(friends)
	}

	async findFriendShip(user_id: number, friend_id: number) {
		return await this.friendRepository.findOne({
			relations: {
				requester: true,
				accepter: true
			},
			where: [
				{requester:{ _id: user_id }, accepter:{	_id: friend_id }},
				{accepter:{	_id: user_id }, requester:{ _id: friend_id }},
			]
		})
	}


    async request_friendship(user_id: number, friend_id: number) {
		if(user_id && friend_id) {
			// console.log("request_friendship");
			
			const user1 = this.usersService.getUser(user_id)
			const user2 = this.usersService.getUser(friend_id)

			const friend = this.friendRepository.create({status: Status.requsted , requester: await user1, accepter: await user2})
			await this.friendRepository.save(friend)
			return friend
		}
	}
	
    async response_friendship(user_id: number, friend_id: number, status: Status ) {
		if(user_id && friend_id) {
			var friendship = await this.findFriendShip(user_id, friend_id)
			// console.log("response_friendship", friendship, status);
			// console.log(user_id, friend_id);
			
			
			if (friendship != undefined) {
				this.friendRepository.update(friendship.id, {status: status})
			}
		}
	}


    // async getFriends(id: number) {
	// 	const user = await this.friendRepository.findOne({
	// 		where: {
	// 			id: id
	// 		},
	// 		relations: {
	// 			friends: true,
	// 		}
	// 	})
	// 	return user.friends
	// }

}
