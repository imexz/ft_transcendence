import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import chatroom from 'src/chatroom/chatroom.entity';
import { Repository } from 'typeorm';
import User from '../users/entitys/user.entity';
import { message } from './message.entity';
// import { timestamp } from 'rxjs';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(message)
        private messageRepository: Repository<message>
        ) {}

    async addMessageReaction(messageId: number, reaction: any) {
        // throw new Error('Method not implemented.');
        //console.log('Method not implemented.');
    }

    async removeMessageReaction(messageId: number, reaction: any) {
        // throw new Error('Method not implemented.');
        //console.log('Method not implemented.');
    }

    async userDeleteMessage(messageId: number, id: number) {
        this.messageRepository.delete({
            _id: messageId,
            sender: {id: id}
        })
    }

    async userAddMessageToRoom(user: User, content: string, chatroom: chatroom, system: boolean): Promise<message> {
        if ((system || user !== undefined) && chatroom != undefined && content != undefined) {
            if (system == true)
                user = undefined

            var new_message = this.messageRepository.create({sender: user, chatroom: chatroom, content: content});
            const message = await this.messageRepository.save(new_message);
            //console.log("userAddMessageToRoom", message);

            return message
        } else {
            //console.log("userAddMessageToRoom goes wrong");
            return undefined
        }
    }

}
