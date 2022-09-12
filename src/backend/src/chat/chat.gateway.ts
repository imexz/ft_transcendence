import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';


@WebSocketGateway()
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


  @SubscribeMessage('typing')

  async typing(
    @MessageBody('isTyping') isTyping: boolean, 
    @ConnectedSocket() client:Socket,
  ) {
    const name = await this.chatService.getClientName(client.id);

    client.broadcast.emit('typing', {name, isTyping});
    
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.chatService.findAll();
  }

//   async create(
//   @MessageBody() createMessageDto: CreateMessageDto,
//   @ConnectedSocket() client: Socket,
//   ) {
//     console.log("createMessage");
    
//   const message = await this.chatService.create(
//     createMessageDto,
//     client.id,
//   );

//     console.log("emit mesage");
//     this.server.emit('message', message);

//   return message;
// }
}



