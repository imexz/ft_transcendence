import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { message } from '../message/message.entity';
import { User } from '../users/entitys/user.entity';
import { Repository } from 'typeorm';
import { chatroom } from '../chatroom/chatroom.entity';

@Injectable()
export class ChatService {


  async createRoom(client_id: string, user_id: number, room_name: string) {

    const user = await this.matchUserWithClient(user_id, client_id)
    if(user == null)
        return null  
    var room = await this.chatroomRepository.findOneBy({name: room_name})
    if(room == null){
        room = this.chatroomRepository.create()
        room.name = room_name
        room.owner = user;
        room.admins = [user]
        room.Users = [user]
        await this.chatroomRepository.save(room)
    }
  }

  async matchUserWithClient(user_id: number, client_id: string) {
    const user = await this.userRepository.findOneBy({id: user_id})
    if(user == null)
        return null
    user.clientId = client_id;
    await this.userRepository.update(user.id, user);
    return user
  }


  async findAllRooms(): Promise<chatroom[]> {
    const rooms =  await this.chatroomRepository.find()
    console.log(rooms);
    return rooms
  }

    async manageLeave(id: string, room_name: string) {

    const user = await this.userRepository.findOne({
        where: {
            clientId: id
        },
        relations: {
            chatrooms: true,
            admin_of: true
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
            await this.userRepository.save(user)


        }

        // user.chatrooms.

    }



  }


  async createMessage(clientId: string, room_name:string, content: string) {
        var new_message = this.messageRepository.create();

        try {
            new_message.user = await this.userRepository.findOneByOrFail({clientId: clientId})
            new_message.chatroom = await this.chatroomRepository.findOneByOrFail({name: room_name})
            new_message.content = content

            return await this.messageRepository.save(new_message)
        } catch (e){
            console.log(e)
            console.log("creat message goes wrong");
        }
    }


  async manageJoin(client_id: string, user_id: number, room_name: string) {
    var user : User;
    if(user_id != undefined && client_id != undefined) {
        user = await this.matchUserWithClient(user_id, client_id);       
    } else if (client_id != undefined) {
        user = await this.userRepository.findOneBy({id: user_id})
    } else {
        user = await this.userRepository.findOneBy({clientId: client_id})
    }
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
            await this.chatroomRepository.save(chatroom)
        }
    }
  }

    constructor(
        @InjectRepository(message)
        private messageRepository: Repository<message>,
        @InjectRepository(User)
        private userRepository:  Repository<User>,
        // private readonly messageService: MessageService,
        @InjectRepository(chatroom)
        private chatroomRepository: Repository<chatroom>,
    ){}

    // create(createMessageDto: CreateMessageDto, id: string) {
    //     throw new Error('Method not implemented.');
    //   }
      async findAllMessages(room_name: string) {
        // var chatroom: chatroom;
        // try{
        //     chatroom = await this.chatroomRepository.findOne({
        //         where: {
        //             name: room_name
        //         },
        //         relations: {
        //             messages: true
        //         }
        //     })
        // } catch (e) {
        //     console.log("findAllMessages error")
        //     console.log(e);
            
        // }

        const messages = await this.messageRepository.find(
            {
                where: {
                    chatroom: {
                        name: room_name
                    }

                },
                relations: {
                    user: true
                }
            }
        )

        // return chatroom.messages
        return messages
      }
  
      async getClientName(clientId: string) {
        const user = await this.userRepository.findOneBy({clientId: clientId})
        console.log("getClientName");
        console.log(clientId);
        console.log(user);
            return user.unique_name
        }
  
      async addClientIdToUser(clientId: string, user_id: number) {
          await this.userRepository.update(user_id, {clientId: clientId})
      }
      
}
