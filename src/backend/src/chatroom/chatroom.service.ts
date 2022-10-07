import { Get, Injectable } from '@nestjs/common';
import { User } from '../users/entitys/user.entity';
import { Column, FindOptionsWhere, ManyToMany, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { chatroom } from './chatroom.entity';
import { message } from 'src/message/message.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatroomService {

     async getAllwithUser(id: number) {
        console.log("getAllwithUser");
        
        const test = await this.chatroomRepository.createQueryBuilder("chatroom")
        // .leftJoinAndSelect('chatroom.users', 'users')
        // .select('chatroom.users')
        .innerJoinAndSelect('chatroom.users', 'user', 'user._id = :id', { id: id })
        .getMany()
            // .where("chatroom.users._id")
            // .addSelect((subQuery) => {
            //     return subQuery.select("user._id", "_id").from("chatroom.users", "user").where({_id: id})
            // }, "name")
            // .where(users )

            // console.log(test);
            return test
            
    }


    async getRoomName(roomId: number): Promise<string> {
        console.log("getRoomName");
        
       const room = await this.chatroomRepository.findOneBy({roomId: roomId})
       console.log(room.roomName);
       

       return room.roomName
    }
    async findOrCreat(room: string | number): Promise<{ chatroom: chatroom; bool: boolean; }> {
        if (room != undefined && room != '')
        {
            let test: FindOptionsWhere<chatroom>
            test = (typeof room === 'string') ? {roomName: room} : {roomId: room}

            var chatroom = await this.chatroomRepository.findOne({
                where: test,
                relations: {
                    admins: true,
                    users: true,
                    owner: true,
                    messages: true
                }
            })
            if(chatroom == null && typeof room === 'string') {
                console.log("chatroom == null");
                
                chatroom = this.chatroomRepository.create({roomName: room})
                return {chatroom, bool: true};
            }
            return {chatroom, bool: false};
        }
        return undefined
    }

    async userToRoom(user: User, roomId: number)
    {
        if(user != null) {
            var ret: { chatroom: chatroom, bool: boolean } 
            ret = await this.findOrCreat(roomId)
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
        console.log("removeUserFromChatroom");
        
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
            if(room.owner._id == user._id) {
                console.log("user is owner");
            }
            console.log(user);
            console.log(room.owner);
            
            var index = room.admins.findIndex(object => {
                return object._id === user._id
            })
            if(index != -1) {
                room.admins.splice(index, 1)
            }
            index = room.users.findIndex(object => {
                return object._id === user._id
            })
            if(index != -1) {
                room.users.splice(index, 1)
            }
            console.log(index);
            
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
            where: {
                access: Not("privat"),
            },
            relations: {
            users: true,
            messages: true
            }
        })

        console.log(rooms);

        return rooms;
    }
    
    async getRoom(room: string | number) {
        console.log("before");
        const test = typeof room === 'string' ? {roomName: room} : {roomId: room}
        
        return await this.chatroomRepository.findOne({where: test})
        console.log("after");
    }
    
    async addRoom(room_name: string, access: string,  user: User, password?: string) {
        const room = await this.getRoom(room_name)
        if(room == null) {
            console.log("room == null");
            
            const room = this.chatroomRepository.create()
            room.roomName = room_name
            room.owner = user;
            room.admins = [user]
            room.users = [user]
            room.access = access
            if (access == 'protected' && password){
                bcrypt.hash(password, 10, function(err, hash) {
                    if (err) {
                        console.log("error hashing");                   
                        return undefined
                    }
                    room.hash = hash
                })    
            } 
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
