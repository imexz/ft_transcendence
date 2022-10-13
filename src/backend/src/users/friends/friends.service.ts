import { Injectable } from '@nestjs/common';
import { Friend, Status } from './friend.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from '../users.service';


@Injectable()
export class FriendsService {

    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>

    private usersService: UsersService

    // async request_friendship(user_id: number, friend_id: number) {
	// 	// console.log(user_id);
	// 	// console.log(friend_id);
    //     var user1 = this.usersService.getUser(user_id)
    //     var user2 = this.usersService.getUser(friend_id)

    //     const friend = this.friendRepository.create({status: Status.requsted , user: [ user1, user2]})
    //     this.friendRepository.save(friend)

	// 	if(user_id && friend_id) {

	// 	}
	// }

    // async getFriends(id: number) {
	// 	const user = await this.friendRepository.findOne({
	// 		where: {
	// 			_id: id
	// 		},
	// 		relations: {
	// 			friends: true,
	// 		}
	// 	})
	// 	return user.friends
	// }

}
