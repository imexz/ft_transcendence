import { ConnectedSocket, MessageBody,  WebSocketServer } from '@nestjs/websockets';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { JwtStrategy } from 'src/auth/jwt-two/jwt.strategy';
import { hostURL } from 'src/hostURL';
import { RequestEnum } from 'src/request.enum';
import { UserStatus } from '../entitys/status.enum';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { FriendsService } from './friends.service';
import { Status } from './friend.entity';
import User from '../entitys/user.entity';



@WebSocketGateway({
  cors: {
    // origin: "*",
    origin: [hostURL + ':8080', hostURL + ':3000'],
    credentials: true
  }
})
export class FriendGateway {

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private readonly friendsService: FriendsService
  ) {}

    @WebSocketServer()
    server: Server;

  async handleConnection(socket) {
    await this.authService.validateSocket(socket)
  }

    async handleDisconnect(socket) {
      // console.log("disconnected", socket.handshake);

      if (socket.handshake.auth != undefined)
        this.usersService.setStatus(socket.handshake.auth.id, UserStatus.OFFLINE)
    }

    @SubscribeMessage('Request')
    async friendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id?: number )
    {
      console.log("Request");

      if(id != client.handshake.auth.id) {
        if(await this.friendsService.findFriendShip(client.handshake.auth.id, id) == undefined){
          client.handshake.auth.friendStatus = Status.requsted;
          (await this.usersService.getUserSocket(this.server, id))?.emit('Request', client.handshake.auth)
          this.friendsService.requestFriendship(client.handshake.auth.id, id)
        } else {
        console.log("friendship alredy exist");

        }
      }

    }

    @SubscribeMessage('Response')
    async response(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id?: number,
    @MessageBody('status') status?: Status    )
    {
      console.log("responseFriendship", status);

      this.friendsService.responseFriendship(client.handshake.auth.id, id, status)
      let friend = await this.findSocketOfUser(id)
      this.server.to(friend.id.toString()).emit('updateFriend', {id: client.handshake.auth.id, status})
    }

    @SubscribeMessage('Remove')
    async remove(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id?: number)
    {
  		this.friendsService.removeFriendship(client.handshake.auth.id, id)
      let friend = await this.findSocketOfUser(id)
      this.server.to(friend.id.toString()).emit('updateFriend', {id: client.handshake.auth.id, status: Status.denied})
    }

    async findSocketOfUser(userId: number) {
      const sockets = await this.server.fetchSockets();
      for (const socket of sockets) {
        if(socket.handshake.auth.id == userId)
        {
          return socket
        }
      }
    }
}
