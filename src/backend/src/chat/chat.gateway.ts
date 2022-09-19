import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { message } from '../message/message.entity';
import { ChatService } from './chat.service';

// const io = require('socket.io')(server, {
//   cors: {
//       origin: "http://localhost:8100",
//       methods: ["GET", "POST"],
//       transports: ['websocket', 'polling'],
//       credentials: true
//   },
//   allowEIO3: true
// });

@WebSocketGateway({
  cors: {
    origin: "*",
    // origin: ['http://localhost:8080', 'http://localhost:3000'],
    // credentials: true
  },
}) //not shure
export class ChatGateway {

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

  handleConnection() {
    console.log('connected')
  }


  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('user_id') user_id: number,
    @MessageBody('room_name') room_name: string,  
    @ConnectedSocket() client:Socket,
  ) {
    console.log("join");
    console.log(user_id);
    client.join(room_name)
    this.chatService.manageJoin(client.id, user_id, room_name)

  }

  @SubscribeMessage('creat')
  async creatRoom(
    @MessageBody('id') user_id: number,
    @MessageBody('room_name') room_name: string,  
    @ConnectedSocket() client:Socket,
  ) {
    console.log("creat");
    console.log(room_name);
    console.log(user_id);
    client.join(room_name);
    await this.chatService.createRoom(client.id, user_id, room_name)
    return await this.chatService.findAllRooms()
    // this.chatService.manageJoin(client.id, user_id, room_name)
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
    console.log("recive typing");
    console.log(client.id)
    
    const name = await this.chatService.getClientName(client.id);

    client.to(room_name).emit('typing', {name, isTyping});
    
  }

  @SubscribeMessage('findAllMessages')
  findAllMessages(@MessageBody('room_name') room_name: string,) {
    console.log('findAllMessages');
    console.log(room_name);
    
    return this.chatService.findAllMessages(room_name);
    // return {test};
  }

  @SubscribeMessage('findAllRooms')
  async findAllRooms(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    console.log("findAllRooms");
    console.log(id);
    console.log(client.id)
    await this.chatService.addClientIdToUser(client.id, id);
    return await this.chatService.findAllRooms();
      // return "test";
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
    
    const message = await this.chatService.createMessage(client.id, room_name, content);

    console.log("emit mesage");
    client.to(room_name).emit('message', message);

    return message;
  }
}



