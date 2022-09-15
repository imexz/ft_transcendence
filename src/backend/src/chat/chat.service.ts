import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { message } from '../message/message.entity';
import { User } from '../users/entitys/user.entity';
import { Repository } from 'typeorm';
import { chatroom } from '../chatroom/chatroom.entity';

@Injectable()
export class ChatService {


  async createRoom(id: string, user_id: number, room_name: string) {
    const user = await this.userRepository.findOneBy({id: user_id})
    if(user_id == null)
        return
    user.clientId = id;
    this.userRepository.update(user.id, user);
    var room = await this.chatroomRepository.findOneBy({name: room_name})
    if(room != null)
        return
    room = this.chatroomRepository.create()
    room.owner = user;
    room.admins = [user]
    room.Users = [user]

  }


  findAllRooms() {
    return this.chatroomRepository.find()
  }

    async manageLeave(id: string, room_name: string) {

    const user = await this.userRepository.findOne({
        where: {
            clientId: id
        },
        relations: {
            chatrooms: true
        }
    })
    if (user != null) {
        const chatroom = await this.chatroomRepository.findOneBy({name: room_name})
        if (chatroom != null) {
            var i = user.chatrooms.indexOf(chatroom)
            if (i != -1) {
                user.chatrooms.splice(i)
            }
            i = user.admin_of.indexOf(chatroom)
            if (i != -1) {
                user.chatrooms.splice(i)
            }
            this.userRepository.save(user)
        }

    }



  }


  async createMessage(clientId: string, room_name:string, content: string) {
        var new_message = this.messageRepository.create();

        try {
            new_message.user = await this.userRepository.findOneByOrFail({clientId: clientId})
            new_message.chatroom = await this.chatroomRepository.findOneByOrFail({name: room_name})
            new_message.content = content
            return await this.messageRepository.save(new_message)
        } catch {
            console.log("creat message");
        }
    }


  async manageJoin(client_id: string, user_id: number, room_name: string) {
    const user = await this.userRepository.findOneBy({id: user_id})
    if(user != null) {
        var chatroom = await this.chatroomRepository.findOne({
            where: {
                id: user_id
            },
            relations: {
                admins: true,
                Users: true
            }
        })
        if(chatroom == null) {
            chatroom = this.chatroomRepository.create({name: room_name, admins: [user], Users: [user]})
            chatroom = await this.chatroomRepository.save(chatroom)
        } else {
            chatroom.Users.push(user)
            this.chatroomRepository.save(chatroom)
        }
    }
  }

    constructor(
        @InjectRepository(message)
        private messageRepository: Repository<message>,
        @InjectRepository(User)
        private userRepository:  Repository<User>,
        @InjectRepository(chatroom)
        private chatroomRepository: Repository<chatroom>,
        // private readonly messageService: MessageService,
    ){}

    // create(createMessageDto: CreateMessageDto, id: string) {
    //     throw new Error('Method not implemented.');
    //   }
      async findAllMessages(room_name: string) {
        const chatroom = await this.chatroomRepository.findOne({
            where: {
                name: room_name
            },
            relations: {
                messages: true
            }
        })
        return chatroom.messages
      }
  
      async getClientName(clientId: string) {
          return (await this.userRepository.findOneBy({clientId: clientId})).unique_name
      }
  
      addClientIdToUser(clientId: string, user_id: number) {
          this.userRepository.update(user_id, {clientId: clientId})
      }
      
}
