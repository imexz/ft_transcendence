import { Injectable } from '@nestjs/common';
import User from '../users/entitys/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Access } from './chatroom.entity';
import chatroom from './chatroom.entity';
import { message } from 'src/message/message.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { BanMuteService } from './banMute/banMute.service';
import { IsNull, Not } from "typeorm"
import { banMute } from './banMute/banMute.entity';

export enum roomReturn {
    created,
    changed
}

@Injectable()
export class ChatroomService {
  async addRoomAdmin(room: number | chatroom, userId: number) {
    console.log("addRoomAdmin");
   var tmpRoom
    if(typeof room == 'number') {
        tmpRoom = await this.getRoomWithAdmins(room)
    } else {
        tmpRoom = room
    }
    if (tmpRoom != undefined) {
        const user = tmpRoom.admins.find(element => element.id == userId)
        if (user == undefined) {
            tmpRoom.admins.push(await this.usersService.getUser(userId))
            this.chatroomRepository.save(tmpRoom)
        }
    }
  }


  async createRoomInfo(roomId: number, id: any): Promise<chatroom> {
    const Room = await this.getRoomWithAdmins(roomId)
    if (Room != null)
    {
        let room = null
        room = Room.users.find(elem => elem.id == id) != undefined? Room : []
        return room ;
    }
    throw new Error("room not found");
  }

     async getAllwithUser(id: number) {
        return await this.chatroomRepository.createQueryBuilder("chatroom")
        .innerJoinAndSelect('chatroom.users', 'user', 'user.id = :user_id', { user_id: id })
        .getMany()
     }

    async hasUserWriteAccess(userId: number, roomId: number): Promise<{allowed: boolean, chatroom: chatroom}> {
        console.log("getAllwithUserWriteAccess");
        // console.log("id = ", id);
        // const mute = this.banMuteService.test()

        const room: chatroom = await this.chatroomRepository.findOne({
            relations: {
                users: true,
                muted: {
                    user: true
                }

            },
            where: {
                roomId: roomId,
                users: {id: userId}
            }
        })

        console.log("room= ", room);

        const muted: banMute | undefined = room.muted.find(elem => elem.user.id == userId)

        if(muted == undefined) {
            return {allowed: true, chatroom: room}
        } else if(room.access != Access.dm && new Date() > new Date(muted.timestamp.getTime() + 1 * 60000)) {
            this.banMuteService.unMute(userId, room)
            return {allowed: true, chatroom: room}
        }
        return {allowed: false,chatroom: room}

        // if (new Date() > new Date(mutedUserRelation.created_at.getTime() + mutedUserRelation.muteTime * 60000)) {
		// 	this.mutedService.deleteMuted(mutedUserRelation.roomMutedUsersId);
		// 	return false;
		// }



    //    return await this.chatroomRepository.createQueryBuilder("chatroom")
    //    .where('chatroom.roomId = :id', {id: roomId})
    //    .innerJoinAndSelect('chatroom.users', 'user', 'user.id = :id1', { id1: id })
    //    .leftJoinAndSelect('chatroom.muted', 'muted')

    //    .getMany()
        // .where('muted.user.id != :iid', {iid: id})
        // .innerJoinAndSelect('chatroom.users', 'user', 'user._id = :id && muted._id != :id', { id: id })
    }

    async getRoomName(roomId: number): Promise<string> {
        // console.log("getRoomName");
       const room = await this.chatroomRepository.findOneBy({roomId: roomId})
    //    console.log(room.roomName);
       return room.roomName
    }

    async findOrCreat(room: number): Promise<{ chatroom: chatroom; bool: boolean; }> {
        if (room != undefined)
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
                // console.log("chatroom == null");

                chatroom = this.chatroomRepository.create({roomName: room})
                return {chatroom, bool: true};
            }
            return {chatroom, bool: false};
        }
        console.log("roomId inside", room);

        return undefined
    }

    async findOrCreatDM(user: User, user1: User): Promise<{info: roomReturn, chatroom: chatroom}> {
        console.log("users = ", user, user1);
        
        if (user != undefined && user1 != undefined)
        {
            var chatroom: chatroom[] = await this.chatroomRepository.find({
                relations: {
                    admins: true,
                    users: true,
                    // owner: true,
                    messages: true,
                    muted: {
                        user: true
                    }

                },
                where: {
                    users: [{id: user.id}, {id: user1.id}],
                    access: Access.dm
                }

            })
            chatroom.forEach(element => { 
                if (element.users.find( elem => elem.id == user.id) != undefined && element.users.find(elem => elem.id == user1.id) != undefined) {
                    return {info: roomReturn.changed, chatroom: chatroom}
                }
            });

            console.log("dm room", chatroom);
            
            // if(chatroom == undefined) {
            var tmpChatroom
            // console.log("chatroom == null");
            tmpChatroom = await this.chatroomRepository.create()
            tmpChatroom.users = [user, user1]
            tmpChatroom.admins = [user, user1]
            // chatroom.owner = user
            tmpChatroom.access = Access.dm
            await this.chatroomRepository.save(tmpChatroom)
            return {info: roomReturn.created, chatroom: tmpChatroom}
            // }
            // return chatroom;
            // .where("post.authorId IN (:authors)", { authors: [3, 7, 9] })
            // var chatroom = await this.chatroomRepository.createQueryBuilder("dm")
            //     .innerJoinAndSelect("dm.users", "users", "user.id IN (:userAr)", {userAr: [user.id, user1.id]})
            //     // .where("users.id == :usr", {usr: user} )
            //     // .andWhere("users.id == :usr1", {usr1: user1})
            //     .getOne()
        }
        // return undefined
    }

    async userToRoom(user: User, roomId: number, password?: string): Promise<boolean>
    {
        if(user != null) {
            var ret: { chatroom: chatroom, bool: boolean }
            console.log("roomId outside: ", roomId);

            ret = await this.findOrCreat(roomId)
            // console.log();
            // console.log("ret: ", ret);

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
                            } 

                        case Access.public:

                        default:
                            console.log(ret.chatroom.muted);

                            if( ret.chatroom.users.indexOf(user) == -1 &&
                                (ret.chatroom.muted == undefined ||
                                ret.chatroom.muted.find((element) => element.user.id == user.id) == undefined))
                            {
                                console.log("sucesfull joind");

                                ret.chatroom.users.push(user)
                            } else {
                                console.log("join goes wrong");

                            }
                        break;
                    }
                }
                await this.chatroomRepository.save(ret.chatroom)
                return true
            }
        }
    }

    async removeUserFromChatroom(user: User, roomId: number) {
        // console.log("removeUserFromChatroom");

        if(user != undefined && roomId != undefined) {
            const room = await this.chatroomRepository.findOne(
                {
                    where: {
                        roomId: roomId
                    }, 
                    relations: {
                        owner: true,
                        admins: true,
                        users: true
                    }
                })
            // if(room.owner.id == user.id) {
            //     console.log("user is owner");
            // }
            // console.log(user);
            // console.log(room.owner);
            if(room.access != Access.dm) {
                var index = room.admins.findIndex(object => {
                    return object.id === user.id
                })
                if(index != -1) {
                    room.admins.splice(index, 1)
                }
                index = room.users.findIndex(object => {
                    return object.id === user.id
                })
                if(index != -1) {
                    room.users.splice(index, 1)
                }
                // console.log(index);
    
                await this.chatroomRepository.save(room)
            }

        }
    }

    constructor(
        @InjectRepository(chatroom)
        private chatroomRepository: Repository<chatroom>,
        private usersService: UsersService,
        private banMuteService: BanMuteService
        // private banMuteService: BanMuteService
    ){}


    async getAll(user: User) {

        const rooms = await this.chatroomRepository.createQueryBuilder("chatroom")
        .leftJoin('chatroom.users', 'us')
        .leftJoin('chatroom.admins', 'ad')
        .leftJoinAndSelect('chatroom.admins', 'admins', "ad.id = :userid1", {userid1: user.id})
        .where("access IN (:...values)", { values: [ Access.protected, Access.public ] })
        .orWhere("us.id = :test", {test: user.id})
        .leftJoinAndSelect('chatroom.users', 'users', "us.id = :userid3", {userid3: user.id})
        .leftJoinAndSelect('chatroom.messages', 'messages', "us.id = :userid2", {userid2: user.id})
        // .leftJoinAndMapOne('chatroom.messages."senderId"', 'chatroom.messages.user.id', 'message', "1 > 0")
        // .addSelect((sub) => {
        //     return sub.select("message.user_id").from(message, 'message').limit(1)
        // }, "chatroom.messages.user_id")
        // .addSelect("chatroom.message.user_id")
        // .leftJoinAndSelect(
        //     qb => qb
        //         .from(message, "test")
        //         .select('test.user_id, test.id, test.timestamp, test.content')
        //     , 'messages', '1 > 0' )
        // .leftJoinAndSelectAndMapOne('chatroom.messages', 'messages', "users.id = :userid2", {userid2: user.id})
        .getMany()

        // console.log("here", rooms);
        rooms.forEach(element => {
            if(element.access == Access.dm) {
                var room_name: string = '';
                // console.log(element.users);
                element.users.forEach(element1 => {
                    room_name += element1.id == user.id ? '' :  element1.username + " "
                });
                element.roomName = room_name;
            }
        });
        return rooms;
    }

    async getRoom(room: string | number) {
        // console.log("before");
        const test = typeof room === 'string' ? {roomName: room} : {roomId: room}
        return await this.chatroomRepository.findOne({where: test})
    }

    async getRoomWithAdmins(room: number | string)  {
        console.log("roomId= ", room);
        
        const test = (typeof room === 'string') ? {roomName: room} : {roomId: room}
        return await this.chatroomRepository.findOne({
        where: test,
        relations: {
            admins: true,
            users: true,
            owner: true
        }})
    }



    async addRoom(room_name: string, access: Access,  user: User, password?: string) : Promise<{ info: roomReturn; chatroom: chatroom; }> {
        // console.log("room_name", room_name);
        
        var room = await this.getRoomWithAdmins(room_name)
        if(room == undefined) {
            console.log("room == null");
            
            room = this.chatroomRepository.create()
            room.roomName = room_name
            room.owner = user;
            room.admins = [user]
            room.users = [user]
            room.access = access
            if(access == Access.protected) {
                this.setPasswordAndSave(password, room)
            }
            return {info: roomReturn.created , chatroom: await this.chatroomRepository.save(room)}
        } else if (room.admins.find(elem => elem.id == user.id) != undefined) {
                console.log("set room = ", Access[access]);
                room.access = access
                if(access == Access.protected)
                    this.setPasswordAndSave(password, room)
            return  {info: roomReturn.changed , chatroom: await this.chatroomRepository.save(room)}
        } else {
            console.log("addRoom goes wrong");
            
        }
        return undefined
    }

    setPasswordAndSave(password: string, room: chatroom) {
        if (password) {
            console.log("setPasswordAndSave");
            
            bcrypt.hash(password, 10, async (err, hash: string) => {
                // console.log("room hash");
                if (err) {
                    // console.log("error hashing");
                    return undefined
                }
                room.hash = hash
                // console.log("geht");
                // console.log(room.hash)
                return await this.chatroomRepository.save(room);
            })
        } else {
            console.log("no password set");
        }
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
