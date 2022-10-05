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
    // console.log("afterInit chat ");

    // console.log(socket);
  }

  async handleConnection(socket) {
    console.log('====connected chat====')

    const rooms = await this.chatService.getUserRooms(socket.handshake.auth.id)

    // rooms.forEach(room => {
    //   socket.join(room.roomName)
    //   console.log("joind");
    //   console.log(room.roomName);
      
    // });

    var tmp = []
    for (let index = 0; index < rooms.length; index++) {
      tmp.push(rooms[index].roomName)
    }
    console.log(tmp);
    
    socket.join(tmp)
    // console.log(socket.handshake);

    
    // socket.emit('successfullConnected');

  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    console.log("join");
    console.log(roomId);
    
    console.log(client.handshake.auth.id);
    const room_name = await this.chatService.getRoomName(roomId)
    client.join(room_name)
    
    this.chatService.manageJoin(client.handshake.auth.id, roomId)
  }

  @SubscribeMessage('leave')
  async leaveRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client:Socket,
  ) {
    console.log("leave");
    
    const room_name = await this.chatService.getRoomName(roomId)
    
    client.leave(room_name);
    this.chatService.manageLeave(client.handshake.auth.id, room_name)
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @MessageBody('roomId') roomId: number,
    @ConnectedSocket() client:Socket,
  ) {
    console.log(roomId)
    console.log("roomId")

    // const name = await this.chatService.getClientName(client.handshake.auth.id);
    const room_name = await this.chatService.getRoomName(roomId)
    // const name = client.id
    const userId = client.handshake.auth.id
    client.to(room_name).emit('typing', { userId, isTyping , roomId});
    // console.log("recive and emit typing");

  }

  @SubscribeMessage('findAllMessages')
  async findAllMessages(@MessageBody('roomId') roomId: number, @ConnectedSocket() client:Socket,) {
    console.log('findAllMessages');
    console.log(roomId);
    console.log(client.handshake);
    console.log(client.handshake.auth.id);
    
    
    return await this.chatService.findAllMessages(roomId);
    // return {test};
  }

  @SubscribeMessage('createMessage')
  async create(
  @MessageBody('roomId') roomId: number,
  @MessageBody('content') content: string,
  @ConnectedSocket() client: Socket,
  ) {
    console.log("createMessage");
    console.log(roomId);
    console.log(content);
    
    const room_name = await this.chatService.getRoomName(roomId)
    
    const message = await this.chatService.createMessage(client.handshake.auth.id, roomId, content);
    
    // client.to(room_name).emit('message', message);
    const tmp = {_id: message._id,
      content: message.content,
      senderId: message.user._id,
      timestamp: message.timestamp,
      avatar: message.user.avatar_url}
      
      client.to(room_name).emit('message', tmp);
      
      
      // console.log(client.);
      
      // console.log("emit mesage");
      // console.log(message);
      // console.log(tmp);
      
      console.log("createMessage ende");
    return tmp;
  }
}
