import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { message } from '../message/message.entity';
import { UsersService } from 'src/users/users.service';
import { ChatroomService, roomReturn } from 'src/chatroom/chatroom.service';
import { MessageService } from 'src/message/message.service';
import User from 'src/users/entitys/user.entity';
import { BanMuteService } from 'src/chatroom/banMute/banMute.service';
import { AdminAction } from 'src/users/entitys/admin.enum';
import chatroom, { Access } from 'src/chatroom/chatroom.entity';

@Injectable()
export class ChatService {
  async adminAction(action: AdminAction, roomId: number, UserId: number, adminId: number): Promise<AdminAction> {
    const room = await this.chatroomService.getRoomWithAdmins(roomId)
    console.log("admins", room.admins, adminId);

    const isAdmin = room.admins.some(element => element.id === adminId );
    console.log(isAdmin);

    if(isAdmin) {
      switch (action) {
        case AdminAction.baned:
          await this.chatroomService.removeUserFromChatroom(await this.usersService.getUser(UserId), roomId)
          return AdminAction.baned
        case AdminAction.muted:
          return this.banMuteService.mut(await this.usersService.getUser(UserId), room)
        case AdminAction.toAdmin:
          this.chatroomService.addRoomAdmin(room, UserId)
          return AdminAction.toAdmin
        default:
          break;
        }
    }
  }



  async creatRoomDM(user: User, id: number) {

    if(user != undefined && id != undefined)
    {
      const user1 = await this.usersService.getUser(id)
      return this.chatroomService.findOrCreatDM(user, user1)
    }
  }

  async createRoomInfo(roomId: number, id: any) {
    return await this.chatroomService.createRoomInfo(roomId, id);
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

        async manageLeave(user_id: number,roomId : number) {
            const user = await this.usersService.getUser(user_id)
            return await this.chatroomService.removeUserFromChatroom(user, roomId)
        }


        async createMessage(user: User, roomId:number, content: string, system: boolean) {
            const object = await this.chatroomService.hasUserWriteAccess(user.id, roomId, system)
            if(object.allowed) {
              if (system)
                user = undefined
              return await this.messageService.userAddMessageToRoom(user, content, object.chatroom, system)
            }

        }

        async createRoom(user: User, room_name: string, access: Access, password?: string) {
          return await this.chatroomService.addRoom(room_name, access, user, password)
        }


        async manageJoin(user_id: number, roomId: number, password?: string) {

            const user = await this.usersService.getUser(user_id)
            const room: chatroom = await this.chatroomService.userToRoom(user, roomId, password);

            return room
        }




        // async findAllMessages(roomId: number, userId: number) {
        //   const rooms = await this.chatroomService.getAllwithUser(userId)
        //   for (let index = 0; index < rooms.length; index++) {
        //     if(rooms[index].roomId == roomId) {
        //       return await this.messageService.getAllMessagesOfRoom(roomId)
        //     }
        //   }
        // }

        async getClientName(id: number) {
            const user = await this.usersService.getUser(id)
            // console.log("getClientName");
            // console.log(id);
            // console.log(user);
            return user.username
        }

        async getRoomName(roomId: number): Promise<string> {
          return await this.chatroomService.getRoomName(roomId)
        }

    }
