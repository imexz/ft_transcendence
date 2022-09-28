import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { message } from './message.entity';
import { User } from '../users/entitys/user.entity';
import { chatroom } from 'src/chatroom/chatroom.entity';

@Injectable()
export class MessageService {
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

    async getAllMessagesOfRoom(room_name: string) {
        const messages = await this.messageRepository.find(
            {
                where: {
                    chatroom: {
                        name: room_name
                    }

                },
                relations: {
                    user: true
                }
            }
        )
        return messages  
    }

}
