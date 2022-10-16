import { Injectable } from '@nestjs/common';
import { Friend, Status } from './friend.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from '../users.service';

@Injectable()
export class FriendsService {
	async getFriends(user_id: number) {

		class test {
			status: number
			senderId: number
			avatar_url: string
			username: string
		}

		const requested: test[] =  await this.friendRepository.createQueryBuilder("friend")
			.innerJoin('friend.requester', 'requester', 'requester._id = :id1', { id1: user_id })
			.leftJoinAndSelect('friend.accepter', 'accepter')
			.select('status, accepter._id  AS "senderId", accepter.avatar_url AS avatar_url, accepter.username AS username')
			.getRawMany()

		console.log("requested");
		console.log(requested);
		
		
		const accepted: test[] =  await this.friendRepository.createQueryBuilder("friend")
			.innerJoin('friend.accepter', 'accepter', 'accepter._id = :id', { id: user_id })
			.leftJoinAndSelect('friend.requester', 'requester')
			.select('status, requester._id  AS "senderId", requester.avatar_url AS avatar_url, requester.username AS username')
			.getRawMany()

		console.log("accepted");
		console.log(requested.concat(accepted));
		
		// const ret = await this.friendRepository.createQueryBuilder("friends")
		// 	.where(accepted.getQuery())
		// 	.orWhere(requested.getQuery())
		// 	.setParameters(accepted.getParameters())
		// 	.setParameters(requested.getParameters())
		// 	.getRawMany()
		
		// console.log(ret);
		return(requested.concat(accepted))
	}

	remove_friendship(_id: any, id: number) {
		throw new Error('Method not implemented.');
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
