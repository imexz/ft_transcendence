import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { hostURL } from 'src/hostURL';
import { AuthService } from 'src/auth/auth.service';


@WebSocketGateway({
  cors: {
    // origin: "*",
    origin: [hostURL + ':8080', hostURL + ':3000'],
    credentials: true
  },
  namespace: 'chat'
})

export class ChatGateway {

  @WebSocketServer()
  server: Server;

  // Socket.use(() => {}) 

  constructor(private readonly chatService: ChatService, private authService: AuthService) {}

  afterInit() {
    // console.log("afterInit chat ");

  }


  async handleConnection(socket) {
    console.log('====connected chat====')
    if (await this.authService.validateSocket(socket)) {
      console.log("validate chat succes full");

// console.log(socket.handshake);

      this.joinRoom(socket)
    }
  }

  @SubscribeMessage('join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId?: number,
    @MessageBody('password') password?: string,)
     {
      console.log("join");

      console.log(client.handshake);
      console.log("join after");

      const rooms = await this.chatService.getUserRooms(client.handshake.auth._id)

      console.log(rooms);
    


    var tmp = []
    for (let index = 0; index < rooms.length; index++) {
      tmp.push(rooms[index].roomId.toString())
    }

    if (roomId != undefined && this.chatService.manageJoin(client.handshake.auth._id, roomId, password)) {
      tmp.push(roomId.toString())
    }
    console.log("tmp = ", tmp);

    client.join(tmp)
  }

  @SubscribeMessage('leave')
  async leaveRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client:Socket,
  ) {
    console.log("leave");

    const room_name = await this.chatService.getRoomName(roomId)

    client.leave(room_name);
    this.chatService.manageLeave(client.handshake.auth._id, room_name)
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @MessageBody('roomId') roomId: any,
    @ConnectedSocket() client:Socket,
  ) {
    // console.log(roomId)
    console.log("typing")

    // const name = await this.chatService.getClientName(client.handshake.auth._id);
    // const room_name = await this.chatService.getRoomName(roomId)
    // const name = client.Id
    const userId = client.handshake.auth._id
    client.to(roomId.toString()).emit('typing', { userId: userId , isTyping , roomId});
    // console.log("recive and emit typing");

  }

  @SubscribeMessage('findAllMessages')
  async findAllMessages(@MessageBody('roomId') roomId: number, @ConnectedSocket() client:Socket,) {
    console.log('findAllMessages');
    console.log(roomId);
    console.log(client.handshake);
    console.log(client.handshake.auth._id);


    return await this.chatService.findAllMessages(roomId, client.handshake.auth._id);
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
    console.log(client.handshake.auth._id);

    // const room_name = await this.chatService.getRoomName(roomId)

    const message = await this.chatService.createMessage(client.handshake.auth._id, roomId, content);

    // client.to(room_name).emit('message', message);
    if(message) {

      const tmp = {
      senderId: client.handshake.auth._id.toString(),
      _id: message._id,
      content: content,
      avatar: message.user.avatar_url,
      timestamp: message.timestamp,
      username: message.user.username }
      // _id: 0,
      // indexId: 12092,


      // console.log(test);
      console.log({tmp, roomId});
      console.log("timestamp before");
      console.log(tmp.timestamp);
      console.log("timestamp after");
      // tmp.timestamp = tmp.timestamp. //TB resume work


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

  @SubscribeMessage('deleteMessage')
  async deleteMessage(
    @MessageBody('messageId') messageId : number,
    @ConnectedSocket() client: Socket,
  ) {
      console.log("delete found");
      console.log(messageId);
      this.chatService.deleteMessage(messageId, client.handshake.auth._id);


  }

  @SubscribeMessage('createMessageReaction')
  async createMessageReaction(
    @MessageBody('messageId') messageId : number,
    @MessageBody('reaction') reaction : any,
    @MessageBody('remove') remove : boolean,
  ) {
      console.log("createMessageReaction");
      console.log(messageId);
      this.chatService.createMessageReaction(messageId, reaction, remove);


  }

  @SubscribeMessage('roomInfo')
  async createRoomInfo(
    @MessageBody('roomId') roomId : number,
    @ConnectedSocket() client: Socket,
  ) {
      console.log("createRoomInfo");
      console.log(roomId);
      return await this.chatService.createRoomInfo(roomId, client.handshake.auth._id);


  }


}
