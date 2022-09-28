import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt-two/jwt-auth.guard';
import { message } from '../message/message.entity';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    // origin: "*",
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true
  },
  // namespace: 'chat'
})

export class ChatGateway {

  // @WebSocketServer()
  // server: Server;

  // server.use()

  // @WebSocketServer()
  // server = new Server({allowEIO3: true});
  // server = require("socket.io")(httpServer, {
  //   allowEIO2: true // false by default
  // });

  // server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }


  afterInit(socket) {
    console.log("afterInit chat ");
    
    // console.log(socket);    
  }

  handleConnection(socket) {
    console.log('connected chat')

    console.log(socket.handshake);
    
    // socket.emit('successfullConnected');
  }

  @SubscribeMessage('join')
	@UseGuards(JwtAuthGuard)
  joinRoom(
    @MessageBody('room_name') room_name: string,  
    @ConnectedSocket() client: Socket,
  ) {
    console.log("join");
    console.log(client.handshake.auth.id);
    client.join(room_name)
    
    this.chatService.manageJoin(client.handshake.auth.id, room_name)
  }

  @SubscribeMessage('leave')
  leaveRoom(
    @MessageBody('room_name') room_name: string,  
    @ConnectedSocket() client:Socket,
  ) {
    console.log("leave");
    client.leave(room_name);
    this.chatService.manageLeave(client.handshake.auth.id, room_name)
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @MessageBody('room_name') room_name: string,  
    @ConnectedSocket() client:Socket,
  ) {
    console.log(client.id)
    
    const name = await this.chatService.getClientName(client.handshake.auth.id);
    // const name = client.id

    client.to(room_name).emit('typing', { name , isTyping});
    console.log("recive and emit typing");
    
  }

  @SubscribeMessage('findAllMessages')
  async findAllMessages(@MessageBody('room_name') room_name: string, @ConnectedSocket() client:Socket,) {
    console.log('findAllMessages');
    console.log(room_name);
    console.log(client.handshake);
    console.log(client.handshake.auth.id);
    
    
    return await this.chatService.findAllMessages(room_name);
    // return {test};
  }

  @SubscribeMessage('createMessage')
  async create(
  @MessageBody('room_name') room_name: string,
  @MessageBody('content') content: string,
  @ConnectedSocket() client: Socket,
  ) {
    console.log("createMessage");
    console.log(room_name);
    console.log(content);
    
    const message = await this.chatService.createMessage(client.handshake.auth.id, room_name, content);

    client.to(room_name).emit('message', message);

    
    // console.log(client.);
     
    console.log("emit mesage");
    console.log(message);
    
    return message;
  }
}



