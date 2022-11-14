import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { message } from './message.entity';
import User from '../users/entitys/user.entity';
import chatroom from 'src/chatroom/chatroom.entity';
// import { timestamp } from 'rxjs';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(message)
        private messageRepository: Repository<message>
        ) {}

    async addMessageReaction(messageId: number, reaction: any) {
        // throw new Error('Method not implemented.');
        console.log('Method not implemented.');
    }

    async removeMessageReaction(messageId: number, reaction: any) {
        // throw new Error('Method not implemented.');
        console.log('Method not implemented.');
    }

    async userDeleteMessage(messageId: number, id: number) {
        this.messageRepository.delete({
            _id: messageId,
            sender: {id: id}
        })
    }

    async userAddMessageToRoom(user: User, conntent: string, chatroom: chatroom) {
        if (user != undefined && chatroom != undefined && conntent != undefined) {
            var new_message = this.messageRepository.create({sender: user, chatroom: chatroom, content: conntent});
            // console.log(conntent);
            return await this.messageRepository.save(new_message);
        } else {
            // console.log("userAddMessageToRoom goes wrong");

        }
    }

    // async getAllMessagesOfRoom(roomId: number) {
    //     const messages = await this.messageRepository.createQueryBuilder("messages")
    //         .leftJoinAndSelect("messages.sender", "sender")
    //         .select('CAST( messages.sender_id AS varchar ) AS "senderId", messages.id, content, user.avatar_url AS avatar, messages.timestamp AS timestamp, user.username AS username')
    //         // .select('messages.user_id AS "senderId", id, content, messages.user')
    //         .where('messages.chatroom.roomId = :roomId', { roomId: roomId})
    //         .orderBy('timestamp')
    //         .getRawMany()

        // console.log("getAllMessagesOfRoom");
        // console.log(roomId);

        // console.log(messages);
        // return messages
    // }

}
