import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageService } from '../message/message.service';


@WebSocketGateway()
export class ChatGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('user_id') user_id: number, 
    @ConnectedSocket() client:Socket,
  ) {
    console.log("join");
    return this.messageService.identify(user_id, client.id)
  }


  @SubscribeMessage('typing')

  async typing(
    @MessageBody('isTyping') isTyping: boolean, 
    @ConnectedSocket() client:Socket,
  ) {
    const name = await this.messageService.getClientName(client.id);

    client.broadcast.emit('typing', {name, isTyping});
    
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messageService.findAll();
  }

  async create(
  @MessageBody() createMessageDto: CreateMessageDto,
  @ConnectedSocket() client: Socket,
  ) {
    console.log("createMessage");
    
  const message = await this.messageService.create(
    createMessageDto,
    client.id,
  );

    console.log("emit mesage");
    this.server.emit('message', message);

  return message;
}
}



