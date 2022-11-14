import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { hostURL } from 'src/hostURL';
import { AuthService } from 'src/auth/auth.service';
import User from 'src/users/entitys/user.entity';
import chatroom, { Access } from 'src/chatroom/chatroom.entity';
import { AdminAction } from 'src/users/entitys/admin.enum';
import { roomReturn } from 'src/chatroom/chatroom.service';


// interface ServerToClientEvents {
//   basicEmit: (rooms: chatroom[]) => void;
// }

export enum changedRoom {
  complet,
  user,
  admin,
  owner,
  access
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
  handleDisconnect() {
    console.log("handleDisconnect");

  }


  async handleConnection(socket) {
    // console.log('====connected chat====')
    if (await this.authService.validateSocket(socket)) {
      // console.log("validate chat succes full");
      const rooms = this.addUserRooms(socket)
    }
  }

  async addUserRooms(client: Socket) {
    const rooms = await this.chatService.getUserRooms(client.handshake.auth.id)
    var tmp: string[] = []
    for (let index = 0; index < rooms.length; index++) {
      tmp.push(rooms[index].roomId.toString())
    }
    client.join(tmp)
}

  @SubscribeMessage('join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    // @MessageBody('roomId') roomId: any,
    @MessageBody('roomId') roomId: number,
    @MessageBody('password') password?: string,
    )
     {
        if (roomId ) {
          const room: chatroom = await this.chatService.manageJoin(client.handshake.auth.id, roomId, password)
          // console.log("bool: ", room);

          if (room) {
            await this.addUserRooms(client)
            console.log("UpdateRoom");
            console.log("UpdateRoom1");
            client.emit('UpdateRoom', {change: changedRoom.complet, roomId: roomId, data: room })
            console.log("UpdateRoom2");
            client.to(roomId.toString()).emit('UpdateRoom', {change: changedRoom.user, roomId: roomId,  data: client.handshake.auth })
            console.log("UpdateRoom3");
          }
        }
  }

  @SubscribeMessage('leave')
  async leaveRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client:Socket,
  ) {
    console.log("leave room", roomId);
    // const room_name = await this.chatService.getRoomName(roomId)

    client.leave(roomId.toString());
    this.chatService.manageLeave(client.handshake.auth.id, roomId)
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

  @SubscribeMessage('action')
  async ban(
    @MessageBody('emiType') emiType: AdminAction,
    @MessageBody('userId') muteUserId: number,
    @MessageBody('roomId') roomId: number,
    @ConnectedSocket() client:Socket,
  ) {
    // console.log(roomId)
    console.log("ban")
    if(await this.chatService.adminAction(emiType, roomId, muteUserId, client.handshake.auth.id) == true) {
      const socket = await this.findSocketOfUser(muteUserId)
      socket.leave(roomId.toString())
    }
    // console.log("recive and emit typing");

  }

  // @SubscribeMessage('findAllMessages')
  // async findAllMessages(@MessageBody('roomId') roomId: number, @ConnectedSocket() client:Socket,) {
  //   // console.log('findAllMessages');
  //   // console.log(roomId);
  //   // console.log(client.handshake);
  //   console.log(client.handshake.auth.id);


  //   return await this.chatService.findAllMessages(roomId, client.handshake.auth.id);
  //   // return {test};
  // }

  @SubscribeMessage('createMessage')
  async create(
  @MessageBody('roomId') roomId: number,
  @MessageBody('content') content: string,
  @ConnectedSocket() client: Socket,
  ) {
    console.log("createMessage");
    console.log(roomId);
    console.log(content);
    console.log(client.handshake.auth.id);
    // const room_name = await this.chatService.getRoomName(roomId)

    const message = await this.chatService.createMessage(client.handshake.auth as User, roomId, content);
    if(message) {
      const tmp = {
      senderId: client.handshake.auth.id.toString(),
      _id: message._id,
      content: content,
      avatar: message.sender.avatar_url,
      timestamp: message.timestamp.toLocaleString(),
      username: message.sender.username }

      // console.log(test);
      // console.log({tmp, roomId});
      // console.log("timestamp before");
      // console.log(tmp.timestamp);
      // console.log("timestamp after");
      // tmp.timestamp = tmp.timestamp. //TB resume work

      client.to(roomId.toString()).emit('message', {message: tmp, roomId});
      this.server.to(roomId.toString()).emit('newMessage', {message: tmp, roomId});
      console.log("createMessage ende");
      return tmp;
    } else {
      // console.log("message == empty");
    }
  }

  @SubscribeMessage('createOrChangeRoom')
  async createRoom(
  @MessageBody('roomName') roomName: string,
  @MessageBody('access') access: Access,
  @ConnectedSocket() client: Socket,
  @MessageBody('password') password?: string,
  ) {
    console.log("createOrChangeRoom");

    console.log("roomName =", roomName, ",access =", access);
    if (roomName.length == 0 || access == undefined)
      return {undefined}

    const room: {info: roomReturn, chatroom: chatroom} = await this.chatService.createRoom(client.handshake.auth as User, roomName, access, password);
    console.log(room);

    if(room.info == roomReturn.created) {
      if (access != Access.private)
      {
        console.log("newRoom emitted", room.chatroom);

        // this.server.to(room.chatroom.roomId.toString()).emit('newRoom', room.chatroom)
        client.emit('newRoom', room.chatroom)
        // console.log("ret:", ret);
        client.broadcast.emit('newRoom', {roomName: room.chatroom.roomName, roomId: room.chatroom.roomId, access: room.chatroom.access});
      }
      else
      {
        client.emit('newRoom', room.chatroom)
      }
     this.addUserRooms(client)

    } else if (room.info == roomReturn.changed) {

      console.log("room changed");
      // if (room.chatroom.access != Access.private)
      client.broadcast.emit('UpdateRoom', {change: changedRoom.access, roomId: room.chatroom.roomId, data: room.chatroom.access})
      this.server.to(room.chatroom.roomId.toString()).emit('UpdateRoom', {change: changedRoom.access, roomId: room.chatroom.roomId, data: room.chatroom.access})
    }
    else {
      console.log("room == empty");
    }
    console.log("createRoom ende", room);
    return room
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

  async findSocketOfUser(userId: number) {
    const sockets = await this.server.fetchSockets();
    for (const socket of sockets) {
      if(socket.handshake.auth.id == userId)
      {
        console.log("gameRequest test");
        return socket
      }
    }
  }


}
