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

  constructor(
    private readonly chatService: ChatService,
    private authService: AuthService
    ) {}

  afterInit() {
    // console.log("afterInit chat ");

  }

  handleDisconnect() {
    console.log("handleDisconnect");

  }

  async handleConnection(socket) {
    if (await this.authService.validateSocket(socket)) {
      const rooms = this.addUserRooms(socket)
    }
  }

  async addUserRooms(client: Socket | any) {
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
    @MessageBody('roomId') roomId: number,
    @MessageBody('password') password?: string,
    )
     {
        if (roomId ) {
          const room: chatroom = await this.chatService.manageJoin(client.handshake.auth.id, roomId, password)
          if (room) {
            await this.addUserRooms(client)
            client.emit('UpdateRoom', {change: changedRoom.complet, roomId: roomId, data: room })
            client.to(roomId.toString()).emit('UpdateRoom', {change: changedRoom.user, roomId: roomId,  data: client.handshake.auth })
          }
        }
  }

      @SubscribeMessage('leave')
      async leaveRoom(
        @MessageBody() roomId: number,
        @ConnectedSocket() client: Socket,
        ) {
          console.log("leave room", roomId);
          this.createSystemMessage(roomId, client.handshake.auth.username + " left the conversation", client)
          client.leave(roomId.toString());
          const room = await this.chatService.manageLeave(client.handshake.auth.id, roomId)
          console.log(room);
        if (room) {
          client.to(roomId.toString()).emit('UpdateRoom', {change: changedRoom.user, roomId: roomId,  data: client.handshake.auth})
          // this.server.to(client).emit('UpdateRoom', {change: changedRoom.complet, roomId: roomId, data: client.handshake.auth})
        }
  }

  @SubscribeMessage('action')
  async ban(
    @MessageBody('emiType') emiType: AdminAction,
    @MessageBody('userId') muteUserId: number,
    @MessageBody('roomId') roomId: number,
    @ConnectedSocket() client:Socket,
  ) {

    const socket = await this.findSocketOfUser(muteUserId)
    const tmp = await this.chatService.adminAction(emiType, roomId, muteUserId, client.handshake.auth.id)
    switch (tmp) {
      case AdminAction.baned:
        console.log("case ban")
        this.createSystemMessage(roomId, socket.handshake.auth.username + " was banned", client)
        socket.leave(roomId.toString())
        this.server.to(roomId.toString()).emit('UpdateRoom', {change: changedRoom.user, roomId: roomId,  data: {userId: muteUserId} })
        break;

        case AdminAction.toAdmin:
        console.log("case toAdmin")
        this.server.to(roomId.toString()).emit('UpdateRoom', {change: changedRoom.admin, roomId: roomId,  data: socket.handshake.auth })
        break;

        case AdminAction.unMuted:
        console.log("case unMuted")
        this.createSystemMessage(roomId, socket.handshake.auth.username + " was unmuted", client)
        break;

        case AdminAction.muted:
          console.log("case muted")
          this.createSystemMessage(roomId, socket.handshake.auth.username + " was muted for one minute", client)
        break;

      default:
        break;
    }
    return tmp

  }

  async createSystemMessage(
    roomId: number,
    content: string,
    client: Socket
    ) {
      const system: boolean = true

      const message = await this.chatService.createMessage(client.handshake.auth as User, roomId, content, system);
    if(message) {
      const tmp = {
      senderId: -1,
      _id: message._id,
      content: content,
      avatar: undefined,
      timestamp: message.timestamp.toLocaleString(),
      username: undefined,
      system: true}

      this.server.to(roomId.toString()).emit('newMessage', {message: tmp, roomId});
      console.log("createSystemMessage ende");
      // return tmp;
    } else {
      // console.log("message == empty");
    }
  }

  @SubscribeMessage('createMessage')
  async createMessage(
  @MessageBody('roomId') roomId: number,
  @MessageBody('content') content: string,
  @ConnectedSocket() client: Socket,
  ) {
    console.log("createMessage");
    console.log(roomId);
    console.log(content);
    console.log(client.handshake.auth.id);
    // const room_name = await this.chatService.getRoomName(roomId)
    const system: boolean = false

    const message = await this.chatService.createMessage(client.handshake.auth as User, roomId, content, system);
    if(message) {
      const tmp = {
      senderId: client.handshake.auth.id.toString(),
      _id: message._id,
      content: content,
      avatar: message.sender.avatar_url,
      timestamp: message.timestamp.toLocaleString(),
      username: message.sender.username }

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
        client.emit('newRoom', room.chatroom)
        client.broadcast.emit('newRoom', {roomName: room.chatroom.roomName, roomId: room.chatroom.roomId, access: room.chatroom.access});
      }
      else
      {
        console.log("before emit", room.chatroom); // TB check for roomName etc. maybe return is needed

        client.emit('newRoom', room.chatroom)
      }
     this.addUserRooms(client)
    } else if (room.info == roomReturn.changed) {
      if (access != Access.private) {
        client.broadcast.emit('UpdateRoom', {change: changedRoom.complet, roomId: room.chatroom.roomId, data: room.chatroom})
      } else {
        client.broadcast.emit('UpdateRoom', {change: changedRoom.access, roomId: room.chatroom.roomId, data: Access.private})
      }
      console.log("room changed");

      // maybe needed to not send private room info to the frontend // TB
      // // if (room.chatroom.access != Access.private)
      // client.broadcast.emit('updateRoom', {change: changedRoom.access, roomId: room.chatroom.roomId, data: room.chatroom.access})
      // this.server.to(room.chatroom.roomId.toString()).emit('updateRoom', {change: changedRoom.access, roomId: room.chatroom.roomId, data: room.chatroom.access})
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
    const room : {info: roomReturn, chatroom: chatroom} = await this.chatService.creatRoomDM(client.handshake.auth as User, id)

    if(room.info == roomReturn.created) {
      const socket = await this.findSocketOfUser(id)
      const toWait = Promise.all([this.addUserRooms(client), this.addUserRooms(socket)]);
      room.chatroom.roomName = socket.handshake.auth.username
      client.emit('newRoom', room.chatroom)
      room.chatroom.roomName = client.handshake.auth.username
      socket.emit('newRoom', room.chatroom)
      await toWait
    }
    this.createMessage(room.chatroom.roomId, content, client)
  }

  async findSocketOfUser(userId: number) {
    const sockets = await this.server.fetchSockets();
    for (const socket of sockets) {
      if(socket.handshake.auth.id == userId)
      {
        // console.log("gameRequest test");
        return socket
      }
    }
  }
}
