import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { message } from '../message/message.entity';
import { ChatService } from './chat.service';


@WebSocketGateway({
  cors: {
    origin: '*',
  }, namespace: 'chat' 
}) //not shure
export class ChatGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('user_id') user_id: number,
    @MessageBody('room_name') room_name: string,  
    @ConnectedSocket() client:Socket,
  ) {
    console.log("join");
    client.join(room_name)
    this.chatService.manageJoin(client.id, user_id, room_name)

  }

  @SubscribeMessage('leave')
  leaveRoom(
    @MessageBody('room_name') room_name: string,  
    @ConnectedSocket() client:Socket,
  ) {
    console.log("leave");
    client.leave(room_name);
    this.chatService.manageLeave(client.id, room_name)
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @MessageBody('room_name') room_name: string,  
    @ConnectedSocket() client:Socket,
  ) {
    const name = await this.chatService.getClientName(client.id);

    client.to(room_name).emit('typing', {name, isTyping});
    
  }

  @SubscribeMessage('findAllMessages')
  findAll(@MessageBody('room_name') room_name: string,) {
    return this.chatService.findAll(room_name);
  }

  @SubscribeMessage('createMessage')
  async create(
  @MessageBody('room_name') room_name: string,
  @MessageBody('content') content: string,
  @ConnectedSocket() client: Socket,
  ) {
    console.log("createMessage");
    
  const message = await this.chatService.createMessage(client.id, room_name, content);

    console.log("emit mesage");
    client.to(room_name).emit('message', message);

  return message;
}
}



