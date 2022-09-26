import { Get, Injectable } from '@nestjs/common';
import { User } from '../users/entitys/user.entity';
import { Column, ManyToMany, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { chatroom } from './chatroom.entity';

@Injectable()
export class ChatroomService {
    constructor(
        @InjectRepository(chatroom)
        private chatroomRepository: Repository<chatroom>
    ){}

    async getAll() {
        return await this.chatroomRepository.find()
    }

    
    async addRoom(room_name: string, access: string,  user: User) {
        const room = this.chatroomRepository.create()
        room.name = room_name
        room.owner = user;
        room.admins = [user]
        room.Users = [user]
        room.access = "private"
        return await this.chatroomRepository.save(room); 
    }
    
    async removeRoom(room_name: string, user: User){

        const room = await this.chatroomRepository.findOne({
            where: {
                name: room_name
            },
            relations: {
                owner: true,
            }
        })
        if (room.owner == user)
        {
            this.chatroomRepository.delete({name: room_name})
        }
    }
    
}
