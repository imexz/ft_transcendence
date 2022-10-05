import { Get, Injectable } from '@nestjs/common';
import { User } from '../users/entitys/user.entity';
import { Column, ManyToMany, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { chatroom } from './chatroom.entity';
import { message } from 'src/message/message.entity';

@Injectable()
export class ChatroomService {
    async findOrCreat(name: string): Promise<{ chatroom: chatroom; bool: boolean; }> {
        if (name != undefined && name != '')
        {
            var chatroom = await this.chatroomRepository.findOne({
                where: {
                    roomName: name
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
                
                chatroom = this.chatroomRepository.create({roomName: name})
                return {chatroom, bool: true};
            }
            return {chatroom, bool: false};
        }
        return undefined
    }

    async userToRoom(user: User, room_name: string)
    {
        if(user != null) {
            var ret: { chatroom: chatroom, bool: boolean } 
            ret = await this.findOrCreat(room_name)
            console.log();
            if(ret != undefined) {
                if(ret.bool) {
                    ret.chatroom.admins = [user]
                    ret.chatroom.users = [user]
                    ret.chatroom.owner = user
                } else {
                    if(ret.chatroom.users.indexOf(user) == -1)
                    ret.chatroom.users.push(user)
                }
                this.chatroomRepository.save(ret.chatroom)
            }
        }
    }

    async removeUserFromChatroom(user: User, room_name: string) {
        if(user != undefined && room_name != undefined) {
            const room = await this.chatroomRepository.findOne(
                {where: {
                    roomName: room_name
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
        // const rooms = await this.chatroomRepository
        //     .createQueryBuilder("chatroom")
        //     // .select(['chatroom.id AS "roomId"', 'chatroom.name AS "roomName"'])
        //     .leftJoinAndSelect("chatroom.users", 'users')
        //     // .getRawMany()
        // if(rooms != undefined)
        //     console.log(rooms);
        // else
        //     console.log("no room");

        // return rooms;

         const rooms = await this.chatroomRepository.find({
            relations: {
            users: true,
            messages: true
            }
        })

        console.log(rooms);

        return rooms;
    }
    
    async getRoom(room_name: string) {
        console.log("before");
        
        return await this.chatroomRepository.findOne({where: {roomName: room_name}})
        console.log("after");
    }
    
    async addRoom(room_name: string, access: string,  user: User) {
        const room = await this.getRoom(room_name)
        if(room == null) {
            console.log("room == null");
            
            const room = this.chatroomRepository.create()
            room.roomName = room_name
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
                roomName: room_name
            },
            relations: {
                owner: true,
            }
        })
        if (room.owner == user)
        {
            this.chatroomRepository.delete({roomName: room_name})
        }
    }
    
}
