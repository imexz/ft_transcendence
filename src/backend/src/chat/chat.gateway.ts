import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { hostURL } from 'src/hostURL';
import { AuthService } from 'src/auth/auth.service';
import User from 'src/users/entitys/user.entity';
import chatroom from 'src/chatroom/chatroom.entity';


interface ServerToClientEvents {
  basicEmit: (rooms: chatroom[]) => void;
}

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
    // console.log('====connected chat====')
    if (await this.authService.validateSocket(socket)) {
      // console.log("validate chat succes full");

// console.log(socket.handshake);

      this.joinRoomTEST(socket)
    }
  }

  async joinRoomTEST(@ConnectedSocket() client: Socket) {
    console.log("joinRoomTEST");

    const rooms = await this.chatService.getUserRooms(client.handshake.auth.id)

      console.log(rooms);



      var tmp = []
      for (let index = 0; index < rooms.length; index++) {
        tmp.push(rooms[index].roomId.toString())
      }
      console.log("tmp = ", tmp);

      client.join(tmp)
      console.log("joinRoomTEST ende");

  }

  @SubscribeMessage('join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    // @MessageBody('roomId') roomId: any,
    @MessageBody('roomId') roomId: number,
    @MessageBody('password') password?: string,
    )
     {
      console.log("Tobi asys", roomId, typeof(roomId));

      console.log("join");
      console.log("roomIdGateway: ", roomId );


      // console.log(client.handshake);
      console.log("roomId", roomId);

      const rooms = await this.chatService.getUserRooms(client.handshake.auth.id)

      // console.log(rooms);
    



      var tmp = []
      for (let index = 0; index < rooms.length; index++) {
        tmp.push(rooms[index].roomId.toString())
      }
      const roomIdNumber: number = Number(roomId)
      const testbool: boolean = await this.chatService.manageJoin(client.handshake.auth.id, roomIdNumber, password)
      console.log("bool: ", testbool);

      if (roomId != undefined && testbool) {
        tmp.push(roomId.toString())
      }
      console.log("tmp = ", tmp);

      client.join(tmp)
      console.log("join after");
      return await this.chatService.findAllMessages(roomId, client.handshake.auth.id)


  }

  @SubscribeMessage('leave')
  async leaveRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client:Socket,
  ) {
    console.log("leave");
    console.log("hoho", roomId);


    const room_name = await this.chatService.getRoomName(roomId)

    client.leave(room_name);
    this.chatService.manageLeave(client.handshake.auth.id, room_name)
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @MessageBody('roomId') roomId: any,
    @ConnectedSocket() client:Socket,
  ) {
    // console.log(roomId)
    // console.log("typing")

    // const name = await this.chatService.getClientName(client.handshake.auth.id);
    // const room_name = await this.chatService.getRoomName(roomId)
    // const name = client.Id
    const userId = client.handshake.auth.id
    client.to(roomId.toString()).emit('typing', { userId: userId , isTyping , roomId});
    // console.log("recive and emit typing");

  }

  @SubscribeMessage('findAllMessages')
  async findAllMessages(@MessageBody('roomId') roomId: number, @ConnectedSocket() client:Socket,) {
    // console.log('findAllMessages');
    // console.log(roomId);
    // console.log(client.handshake);
    console.log(client.handshake.auth.id);


    return await this.chatService.findAllMessages(roomId, client.handshake.auth.id);
    // return {test};
  }

  @SubscribeMessage('createMessage')
  async create(
  @MessageBody('roomId') roomId: number,
  @MessageBody('content') content: string,
  @ConnectedSocket() client: Socket,
  ) {
    // console.log("createMessage");
    // console.log(roomId);
    // console.log(content);
    // console.log(client.handshake.auth.id);

    // const room_name = await this.chatService.getRoomName(roomId)

    const message = await this.chatService.createMessage(client.handshake.auth.id, roomId, content);

    // client.to(room_name).emit('message', message);
    if(message) {
      const tmp = {
      senderId: client.handshake.auth.id.toString(),
      _id: message._id,
      content: content,
      avatar: message.sender.avatar_url,
      timestamp: message.timestamp,
      username: message.sender.username }
      // id: 0,
      // indexId: 12092,

      // console.log(test);
      // console.log({tmp, roomId});
      // console.log("timestamp before");
      // console.log(tmp.timestamp);
      // console.log("timestamp after");
      // tmp.timestamp = tmp.timestamp. //TB resume work


      client.to(roomId.toString()).emit('message', {message: tmp, roomId});
      client.to(roomId.toString()).emit('newMessage', {message: tmp, roomId});
      console.log("createMessage ende");
      return tmp;
    } else {
      // console.log("message == empty");

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
      this.chatService.deleteMessage(messageId, client.handshake.auth.id);


  }

  @SubscribeMessage('createMessageReaction')
  async createMessageReaction(
    @MessageBody('messageId') messageId : number,
    @MessageBody('reaction') reaction : any,
    @MessageBody('remove') remove : boolean,
  ) {
      // console.log("createMessageReaction");
      // console.log(messageId);
      this.chatService.createMessageReaction(messageId, reaction, remove);


  }

  @SubscribeMessage('roomInfo')
  async createRoomInfo(
    @MessageBody('roomId') roomId : number,
    @ConnectedSocket() client: Socket,
  ) {
      console.log("createRoomInfo");
      console.log(roomId);
      return await this.chatService.createRoomInfo(roomId, client.handshake.auth.id);
  }

  @SubscribeMessage('DM')
  async creatRoomDM(
    @ConnectedSocket() client: Socket,
    @MessageBody('content') content: string,
    @MessageBody('id') id: number,
  ) {
    this.chatService.creatRoomDM(client.handshake.auth as User, id, content)
  }


}
