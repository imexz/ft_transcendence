import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { message } from '../message/message.entity';
import { UsersService } from 'src/users/users.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class ChatService {
  async getUserRooms(id: any) {
    return await this.chatroomService.getAllwithUser(id)
  }


    constructor(
        private chatroomService: ChatroomService,
        private usersService: UsersService,
        private messageService: MessageService,
        ){}
        
        async manageLeave(user_id: number, room_name: string) {
            const user = await this.usersService.getUser(user_id)
            await this.chatroomService.removeUserFromChatroom(user, room_name)
        }
        
        
        async createMessage(user_id: number, roomId:number, content: string) {
            const user = await this.usersService.getUser(user_id)
            const rooms = await this.chatroomService.getAllwithUser(user_id)
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
    