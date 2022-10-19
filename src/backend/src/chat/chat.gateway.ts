import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt-two/jwt-auth.guard';
import { message } from '../message/message.entity';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { hostURL } from 'src/hostURL';


@WebSocketGateway({
  cors: {
    // origin: "*",
    origin: [hostURL + ':8080', hostURL + ':3000'],
    credentials: true
  },
  namespace: 'chat'
})

export class ChatGateway {

  constructor(private readonly chatService: ChatService, private jwtService: JwtService) {}

  afterInit(socket) {
    // console.log("afterInit chat ");

    // console.log(socket);
  }

  async handleConnection(socket) {
    console.log('====connected chat====')
    console.log(socket.handshake);


    try {
      socket.handshake.auth = this.jwtService.verify(socket.handshake.auth.id.replace('Authentication=',''));
      console.log("socket handshake");
      
      console.log(socket.handshake.auth);
      
    } catch (error) {
      console.log("wrong token");
      socket.disconnect()
      return
    }
    
		
// console.log(socket.handshake.auth.Id);

//     if (socket.handshake.auth.Id == undefined) {
//       console.log("client not outorised diconnect");
//       socket.disconnect()

//     }
    const rooms = await this.chatService.getUserRooms(socket.handshake.auth.Id)
    

    // rooms.forEach(room => {
    //   socket.join(room.roomName)
    //   console.log("joind");
    //   console.log(room.roomName);
      
    // });

    var tmp = []
    for (let index = 0; index < rooms.length; index++) {
      tmp.push(rooms[index].roomId.toString())
    }
    // console.log(tmp);
    
    socket.join(tmp)
    // console.log(socket.handshake);

    
    // socket.emit('successfullConnected');

  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody('roomId') roomId: number,
    @MessageBody('password') password: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log("join");
    console.log(roomId);
    
    console.log(client.handshake.auth);
    // const room_name = await this.chatService.getRoomName(roomId)
    
    if (this.chatService.manageJoin(client.handshake.auth.Id, roomId, password))
    {
      client.join(roomId.toString())
    }
  }

  @SubscribeMessage('leave')
  async leaveRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client:Socket,
  ) {
    console.log("leave");
    
    const room_name = await this.chatService.getRoomName(roomId)
    
    client.leave(room_name);
    this.chatService.manageLeave(client.handshake.auth.Id, room_name)
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @MessageBody('roomId') roomId: any,
    @ConnectedSocket() client:Socket,
  ) {
    console.log(roomId)
    console.log("roomId")

    // const name = await this.chatService.getClientName(client.handshake.auth.Id);
    // const room_name = await this.chatService.getRoomName(roomId)
    // const name = client.Id
    const userId = client.handshake.auth.Id
    client.to(roomId.toString()).emit('typing', { userId: userId , isTyping , roomId});
    // console.log("recive and emit typing");

  }

  @SubscribeMessage('findAllMessages')
  async findAllMessages(@MessageBody('roomId') roomId: number, @ConnectedSocket() client:Socket,) {
    console.log('findAllMessages');
    console.log(roomId);
    console.log(client.handshake);
    console.log(client.handshake.auth.Id);
    
    
    return await this.chatService.findAllMessages(roomId, client.handshake.auth.Id);
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
    
    // const room_name = await this.chatService.getRoomName(roomId)
    
    const message = await this.chatService.createMessage(client.handshake.auth.Id, roomId, content);
    
    // client.to(room_name).emit('message', message);
    if(message) {
      const tmp = {
      senderId: client.handshake.auth.Id.toString(),
      _id: message._id,
      content: content,
      avatar: message.user.avatar_url,
      timestamp: message.timestamp }
      // _id: 0,
      // indexId: 12092,

      const test = roomId.toString()

      // console.log(test);
      console.log({tmp, roomId});
      
      
      client.to(roomId.toString()).emit('message', {message: tmp, roomId});
      console.log("createMessage ende");
      return tmp;
    } else {
      console.log("message == empty");
      
    }
      
      // console.log(client.);
      
      // console.log("emit mesage");
      // console.log(message);
      // console.log(tmp);
      
  }


}
