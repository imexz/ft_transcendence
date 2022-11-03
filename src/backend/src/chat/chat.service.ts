import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { message } from '../message/message.entity';
import { UsersService } from 'src/users/users.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { MessageService } from 'src/message/message.service';
import User from 'src/users/entitys/user.entity';
import { BanMuteService } from 'src/chatroom/banMute/banMute.service';

@Injectable()
export class ChatService {
  async ban(roomId: number, muteUserId: number, userId: number) {
    const room = this.chatroomService.getRoom(roomId)
    const user = await this.usersService.getUser(muteUserId)
    const chatroom = await this.chatroomService.getRoom(roomId)
    this.banMuteService.Ban(user, chatroom)
  }

  async creatRoomDM(user: User, id: number, content: string) {
    if(user != undefined && id != undefined)
    {
      console.log(content);
      
      const user1 = await this.usersService.getUser(id)
      const chatroom = await this.chatroomService.findOrCreatDM(user, user1)
      this.messageService.userAddMessageToRoom(user, content, chatroom.chatroom)
    }
  }

  async createRoomInfo(roomId: number, _id: any) {
    return await this.chatroomService.createRoomInfo(roomId, _id);
  }

  async createMessageReaction(messageId: number, reaction: any, remove: boolean) {
    if (!remove)
      return await this.messageService.addMessageReaction(messageId, reaction);
    else
      return await this.messageService.removeMessageReaction(messageId, reaction);
  }

  deleteMessage(messageId: number, id: number) {
    this.messageService.userDeleteMessage(messageId, id);
  }

  async getUserRooms(id: number) {
    return await this.chatroomService.getAllwithUser(id)
  }


    constructor(
        private chatroomService: ChatroomService,
        private usersService: UsersService,
        private banMuteService: BanMuteService,
        private messageService: MessageService,
        ){}

        async manageLeave(user_id: number, room_name: string) {
            const user = await this.usersService.getUser(user_id)
            await this.chatroomService.removeUserFromChatroom(user, room_name)
        }


        async createMessage(user: User, roomId:number, content: string) {
            const rooms = await this.chatroomService.getAllwithUserWriteAccess(user._id)
            console.log("rooms=", rooms);
            
            for (let index = 0; index < rooms.length; index++) {
              if(rooms[index].roomId == roomId) {
                return await this.messageService.userAddMessageToRoom(user, content, rooms[index])
              }
            }

        }


        async manageJoin(user_id: number, roomId: number, password?: string) {
            const user = await this.usersService.getUser(user_id)
            return this.chatroomService.userToRoom(user, roomId, password);
        }
        



        async findAllMessages(roomId: number, userId: number) {
          const rooms = await this.chatroomService.getAllwithUser(userId)
          for (let index = 0; index < rooms.length; index++) {
            if(rooms[index].roomId == roomId) {
              return await this.messageService.getAllMessagesOfRoom(roomId)
            }
          }
        }

        async getClientName(id: number) {
            const user = await this.usersService.getUser(id)
            console.log("getClientName");
            console.log(id);
            console.log(user);
            return user.username
        }

        async getRoomName(roomId: number): Promise<string> {
          return await this.chatroomService.getRoomName(roomId)
        }

    }
