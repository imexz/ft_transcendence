import { Injectable } from '@nestjs/common';
import { Friend, Status } from './friend.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";
import { UsersService } from '../users.service';

interface friend {
	status: number;
	senderId: number;
	avatar_url: string;
	username: string;
}

@Injectable()
export class FriendsService {

	async getRequestedFriends(user_id): Promise<friend[]> {
		return await this.friendRepository.createQueryBuilder("friend")
			.innerJoin('friend.requester', 'requester', 'requester._id = :id1', { id1: user_id })
			.leftJoinAndSelect('friend.accepter', 'accepter')
			.select('status, accepter._id  AS "_id", accepter.avatar_url AS avatar_url, accepter.username AS username, 1 AS me')
			.getRawMany()
	}

	async getAskedFriends(user_id): Promise<friend[]>{
		return await this.friendRepository.createQueryBuilder("friend")
			.innerJoin('friend.accepter', 'accepter', 'accepter._id = :id', { id: user_id })
			.leftJoinAndSelect('friend.requester', 'requester')
			.select('status, requester._id  AS "_id", requester.avatar_url AS avatar_url, requester.username AS username, 0 AS me')
			.getRawMany()
	}

	async getFriends(user_id: number) {

		const requested: friend[] = await this.getRequestedFriends(user_id)
		const accepted: friend[] = await this.getAskedFriends(user_id)
		console.log("accepted");
		console.log(requested.concat(accepted));
		return(requested.concat(accepted))
	}

	async remove_friendship(_id: any, id: number) {
		console.log("remove_friendship");
		console.log(_id, id);
		
		
		const friends = await this.friendRepository.findOne({
			relations: {
				requester: true,
				accepter: true
			},
			where: [
				{requester:{ _id: _id }, accepter:{	_id: id }},
				{accepter:{	_id: _id }, requester:{ _id: id }},
			]
		})
		console.log(friends);
		
		// const test: FindOptionsWhere<Friend> = 
		return await this.friendRepository.remove(friends)
	}

	constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    private readonly usersService: UsersService){}

    async request_friendship(user_id: number, friend_id: number) {
		// console.log(user_id);
		// console.log(friend_id);
		if(user_id && friend_id) {
			const user1 = this.usersService.getUser(user_id)
			const user2 = this.usersService.getUser(friend_id)

			const friend = this.friendRepository.create({status: Status.requsted , requester: await user1, accepter: await user2})
			await this.friendRepository.save(friend)
			return friend
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
