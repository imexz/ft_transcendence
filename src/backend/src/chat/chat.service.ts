import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { message } from '../message/message.entity';
import { User } from '../users/entitys/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(message)
        private messageRepository: Repository<message>,
        private userRepository:  Repository<User>
    ){}

    create(createMessageDto: CreateMessageDto, id: string) {
        throw new Error('Method not implemented.');
      }
      findAll() {
        return this.messageRepository.
      }
  
      async getClientName(clientId: string) {
          return (await this.userRepository.findOneBy({clientId: clientId})).unique_name
      }
  
      identify(user_id: number, clientId: string) {
          this.userRepository.update(user_id, {clientId: clientId})
      }
      
}
