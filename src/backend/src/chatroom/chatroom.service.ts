import { Injectable } from '@nestjs/common';
import User from '../users/entitys/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Access, chatroom } from './chatroom.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { BanMuteService } from './banMute/banMute.service';

@Injectable()
export class ChatroomService {
  async addRoomAdmin(roomId: number, userId: number) {
    console.log("addRoomAdmin");
    
    const room  = await this.chatroomRepository.findOne({
        where: {
            roomId: roomId
        },
        relations: {
            admins: true
        }
    })
    if (room != undefined) {
        const user = room.admins.find(element => element._id == userId)
        if (user == undefined) {
            room.admins.push(await this.usersService.getUser(userId))
            this.chatroomRepository.save(room)
        }
    }
  }


  async createRoomInfo(roomId: number, _id: any){

    console.log("createRoomInfoService");


    const Room = await this.chatroomRepository.findOne({
        where: {
            roomId: roomId
        },
        relations: {
            users: true,
            admins: true
        }
    })
    console.log(Room)

    if (Room != null)
    {
        let room = null
        for(let k = 0; k < Room.users.length; ++k)
        {
            if (Room.users[k]._id == _id)
            room = Room;
        }
        let isAdmin : Boolean

        if (room == null)
        {
            room = []
            return {room, isAdmin}
        }

        for(let j = 0; j < room.admins.length; ++j)
        {
            if (room.admins[j]._id == _id)
                isAdmin = true
        }

        if (isAdmin == undefined)
            isAdmin = false
        console.log("isAdmin:");
        console.log(isAdmin);

        console.log("end createRoomInfoService");
        console.log(room);

        return { room, isAdmin };
    }
    console.log("end createRoomInfoService with error");
    throw new Error("room not found");

    // const room = rooms.find(roomId)

    // console.log(room);

    // return room
  }

     async getAllwithUser(id: number) {
        // console.log("getAllwithUser");
        // console.log("id = ", id);

       return await this.chatroomRepository.createQueryBuilder("chatroom")
        .innerJoinAndSelect('chatroom.users', 'user', 'user._id = :id', { id: id })
        .getMany()
    }

    async getAllwithUserWriteAccess(id: number, roomId: number) {
        console.log("getAllwithUserWriteAccess");
        // console.log("id = ", id);
        // const mute = this.banMuteService.test()

       return await this.chatroomRepository.createQueryBuilder("chatroom")
       .where('chatroom.roomId = :id', {id: roomId})
       .innerJoinAndSelect('chatroom.users', 'user', 'user._id = :id1', { id1: id })
       .leftJoinAndSelect('chatroom.muted', 'muted','user._id != :id2', { id2: id })
        // .where('muted.user._id != :iid', {iid: id})
        // .innerJoinAndSelect('chatroom.users', 'user', 'user._id = :id && muted._id != :id', { id: id })
        .getMany()
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
                    messages: true,
                    muted: {
                        user: true
                    }
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

    async findOrCreatDM(user: User, user1: User): Promise<{ chatroom: chatroom; bool: boolean; }> {
        if (user != undefined && user1 != undefined)
        {

            var chatroom = await this.chatroomRepository.findOne({
                relations: {
                    admins: true,
                    users: true,
                    owner: true,
                    messages: {
                        user: true
                    }
                },
                where: {
                    users: [{_id: user._id}, {_id: user1._id}],
                    access: Access.dm
                }
            })
            if(chatroom == null) {
                console.log("chatroom == null");
                chatroom = await this.chatroomRepository.create()
                chatroom.users = [user, user1]
                chatroom.admins = [user, user1]
                // chatroom.owner = user
                chatroom.access = Access.dm
                await this.chatroomRepository.save(chatroom)
                return {chatroom, bool: true};
            }
            return {chatroom, bool: false};
        }
        return undefined
    }

    async userToRoom(user: User, roomId: number, password?: string): Promise<boolean>
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
                    switch (ret.chatroom.access) {
                        case Access.protected:
                            if(await bcrypt.compare(password, ret.chatroom.hash) == false) {
                                console.log("result === false");
                                return false
                            } else {
                                console.log("result === true");
                                // this.chatroomRepository.save(ret.chatroom)
                            }

                            case Access.public:

                            default:
                                console.log(ret.chatroom.muted);
                                
                                if( ret.chatroom.users.indexOf(user) == -1 &&
                                    (ret.chatroom.muted == undefined ||
                                    ret.chatroom.muted.find((element) => element.user._id == user._id) == undefined))
                                {
                                    console.log("sucesfull joind");
                                    
                                    ret.chatroom.users.push(user)
                                } else {
                                    console.log("join goes wrong");
                                    
                                }
                            break;
                    }
                }
                this.chatroomRepository.save(ret.chatroom)
                return true
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
        private chatroomRepository: Repository<chatroom>,
        private usersService: UsersService,
        // private banMuteService: BanMuteService
    ){}

    async getAll(user: User) {
        const rooms = await this.chatroomRepository.createQueryBuilder("chatroom")
        .leftJoinAndSelect('chatroom.users', 'us')
        .leftJoinAndSelect('chatroom.admins', 'admins')
        .where("access IN (:...values)", { values: [ Access.protected, Access.public ] })
        .orWhere("us._id = :test", {test: user._id})
        .leftJoinAndSelect('chatroom.users', 'users')
        .getMany()

        console.log(rooms);
        rooms.forEach(element => {
            if(element.access == Access.dm) {
                var room_name: string = '';
                console.log(element.users);
                element.users.forEach(element1 => {
                    room_name += element1._id == user._id ? '' :  element1.username + " "
                });
                element.roomName = room_name;
            }
        });
        return rooms;
    }

    async getRoom(room: string | number) {
        console.log("before");
        const test = typeof room === 'string' ? {roomName: room} : {roomId: room}
        return await this.chatroomRepository.findOne({where: test})
    }

    async getRoomAdmins(room: number)  {
        console.log("roomId", room);
        
        return await this.chatroomRepository.createQueryBuilder('room')
        .where("room.roomId = :roo", {roo: room})
        .leftJoinAndSelect('room.admins', 'admins')
        .select('admins._id AS id')
        .getRawMany()
        // .where()
    }

    async addRoom(room_name: string, access: Access,  user: User, password?: string) {
        const room = await this.getRoom(room_name)
        if(room == null) {
            console.log("room == null");

            const room = this.chatroomRepository.create()
            room.roomName = room_name
            room.owner = user;
            room.admins = [user]
            room.users = [user]
            room.access = access
            if (access == Access.protected && password) {
                console.log("password set");
                bcrypt.hash(password, 10, async (err, hash: string) => {
                    console.log("room hash");
                    if (err) {
                        console.log("error hashing");
                        return undefined
                    }
                    room.hash = hash
                    console.log("geht");
                    console.log(room.hash)
                    return await this.chatroomRepository.save(room);
                })
            } else {
                console.log("no password set");
            }
            // console.log("room hash after")
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
