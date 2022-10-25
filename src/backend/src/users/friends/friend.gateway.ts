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
import { User } from '../entitys/user.entity';



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
      console.log("disconnected", socket.handshake);
      
      if (socket.handshake.auth != undefined)
        this.usersService.setStatus(socket.handshake.auth._id, UserStatus.OFFLINE)
    }

    @SubscribeMessage('Request')
    async gameRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id?: number )
    {
      console.log("Request");
      
      if(id != client.handshake.auth._id) {
        if(await this.friendsService.findFriendShip(client.handshake.auth._id, id) == undefined){
          client.handshake.auth.friendStatus = Status.requsted;
          (await this.usersService.getUserSocket(this.server, id))?.emit("Request", client.handshake.auth)
          this.friendsService.request_friendship(client.handshake.auth._id, id)
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
      // (await this.usersService.getUserSocket(this.server, id))?.emit("Request", {id, status})
      this.friendsService.response_friendship(client.handshake.auth._id, id, status)
    }

    @SubscribeMessage('Remove')
    async remove(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id?: number)
    {
  		this.friendsService.remove_friendship(client.handshake.auth._id, id)
    }
}