import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { message } from './message.entity';
import { User } from '../users/entitys/user.entity';
import { chatroom } from 'src/chatroom/chatroom.entity';
import { timestamp } from 'rxjs';

@Injectable()
export class MessageService {
    userDeleteMessage(messageId: number, id: number) {
        this.messageRepository.delete({
            _id: messageId,
            user: {_id: id}
        })
    }
    constructor(
        @InjectRepository(message)
        private messageRepository: Repository<message>
    ) {}

    async userAddMessageToRoom(user: User, conntent: string, chatroom: chatroom) {
        if (user != undefined && chatroom != undefined && conntent != undefined) {
            var new_message = this.messageRepository.create({user: user, chatroom: chatroom, content: conntent});
            return await this.messageRepository.save(new_message);
        } else {
            console.log("userAddMessageToRoom goes wrong");

        }
    }

    async getAllMessagesOfRoom(roomId: number) {
        const messages = await this.messageRepository.createQueryBuilder("messages")
            .leftJoinAndSelect("messages.user", "user")
            .select('CAST( messages.user_id AS varchar ) AS "senderId", messages._id, content, user.avatar_url AS avatar, messages.timestamp AS timestamp')
            // .select('messages.user_id AS "senderId", _id, content, messages.user')
            .where('messages.chatroom.roomId = :roomId', { roomId: roomId})
            .orderBy('timestamp')
            .getRawMany()

        console.log("getAllMessagesOfRoom");
        console.log(roomId);

        console.log(messages);


        return messages
    }

}
