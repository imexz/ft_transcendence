import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { message } from '../message/message.entity';
import { User } from '../users/entitys/user.entity';
import { Repository } from 'typeorm';
import { chatroom } from 'src/chatroom/chatroom.entity';

@Injectable()
export class ChatService {
  async manageJoin(client_id: string, user_id: number, room_name: string) {
    const user = await this.userRepository.findOneBy({id: user_id})
    if(user != null) {
        var chatroom = await this.chatroomRepository.findOne({
            where: {
                id: user_id
            },
            relations: {
                admins: true,
                Users: true
            }
        })
        if(chatroom == null) {
            chatroom = this.chatroomRepository.create({name: room_name, admins: [user], Users: [user]})
            chatroom = await this.chatroomRepository.save(chatroom)
        } else {
            chatroom.Users.push(user)
            this.chatroomRepository.save(chatroom)
        }
    }
  }

    constructor(
        @InjectRepository(message)
        private messageRepository: Repository<message>,
        @InjectRepository(User)
        private userRepository:  Repository<User>,
        @InjectRepository(chatroom)
        private chatroomRepository: Repository<chatroom>,
    ){}

    // create(createMessageDto: CreateMessageDto, id: string) {
    //     throw new Error('Method not implemented.');
    //   }
      findAll() {
        return this.messageRepository.find()
      }
  
      async getClientName(clientId: string) {
          return (await this.userRepository.findOneBy({clientId: clientId})).unique_name
      }
  
      addClientIdToUser(clientId: string, user_id: number) {
          this.userRepository.update(user_id, {clientId: clientId})
      }
      
}
