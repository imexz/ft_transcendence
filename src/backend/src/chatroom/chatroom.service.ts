import { Get, Injectable } from '@nestjs/common';
import { User } from '../users/entitys/user.entity';
import { Column, ManyToMany, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { chatroom } from './chatroom.entity';

@Injectable()
export class ChatroomService {
    async findOrCreat(name: string): Promise<{ chatroom: chatroom; bool: boolean; }> {
        if (name != undefined && name != '')
        {
            var chatroom = await this.chatroomRepository.findOne({
                where: {
                    name: name
                },
                relations: {
                    admins: true,
                    users: true,
                    owner: true,
                    messages: true
                }
            })
            if(chatroom == null) {
                console.log("chatroom == null");
                
                chatroom = this.chatroomRepository.create({name: name})
                return {chatroom, bool: true};
            }
            return {chatroom, bool: false};
        }
    }

    async userToRoom(user: User, room_name: string)
    {
        if(user != null) {
            const { chatroom, bool} = await this.findOrCreat(room_name)
            if(bool) {
                chatroom.admins = [user]
                chatroom.users = [user]
                chatroom.owner = user
            } else {
                chatroom.users.push(user)
            }
            this.chatroomRepository.save(chatroom)
        }
    }

    async removeUserFromChatroom(user: User, room_name: string) {
        if(user != undefined && room_name != undefined) {
            const room = await this.chatroomRepository.findOne(
                {where: {
                    name: room_name
            },
            relations: {
                owner: true,
                admins: true,
                users: true
            }})
            if(room.owner == user) {
                console.log("user is owner");
            }
            var index = room.admins.indexOf(user)
            if(index != -1) {
                room.admins.splice(index, 1)
            }
            index = room.users.indexOf(user)
            if(index != -1) {
                room.users.splice(index, 1)
            }
            await this.chatroomRepository.save(room)

        }
    }



    constructor(
        @InjectRepository(chatroom)
        private chatroomRepository: Repository<chatroom>
    ){}

    async getAll() {
        return await this.chatroomRepository.find()
    }
    
    async getOne(name: string) {
        return await this.chatroomRepository.findOneBy({name: name})
    }

    async findOne(room_name: string) {
        return await this.chatroomRepository.findOneBy({name: room_name})
    }
    
    async addRoom(room_name: string, access: string,  user: User) {
        const room = await this.findOne(room_name)
        if(room == null) {
            console.log("room == null");
            
            const room = this.chatroomRepository.create()
            room.name = room_name
            room.owner = user;
            room.admins = [user]
            room.users = [user]
            room.access = access
            return await this.chatroomRepository.save(room);     
        }
        return undefined
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
