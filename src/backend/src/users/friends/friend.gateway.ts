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
import { Settings } from 'src/game/game.entities/settings';
import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { GameService } from 'src/game/game.service';
import { GameGateway } from 'src/game/game.gateway';



enum RESPONSE {
  accept,
  refuse
}

@WebSocketGateway({
  cors: {
    // origin: "*",
    origin: [hostURL + ':8080', hostURL + ':3000'],
    credentials: true
  }
})
export class Gateway {

  @WebSocketServer()
  server: Server;
  
  
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway
    ) {}
    
    async askUserToPlay(user: User, id: number, settings: Settings) {
      const socket = await this.usersService.getUserSocket(this.server, id)
      if (socket == undefined) {
        console.log("gameRequest: opponent is offline");
      } else {
        var receivedSettings = false
        var response = {data: null as RESPONSE};

        await socket.emit('GameRequestFrontend',{ user, settings},  function ( data: RESPONSE)  {
          console.log("GameRequestFrontend beginn");
          response.data = data
          console.log("in call back ", data)
        } 
        )
        
        this.responseGameRequest(response, user, settings, id)
        }
      }
      
      async responseGameRequest(data: { data: RESPONSE}, user, settings, id) {
        console.log("start async");
        while (data.data == undefined) {
          await new Promise(r => setTimeout(r, 10));
        }
        console.log(data.data);
        if (data.data == RESPONSE.accept) {
          const game = this.gameService.joinGameOrCreateGame( user, settings, id)
          this.gameGateway.joinGameRoom(await this.gameGateway.findSocketOfUser(user.id), await  game)
        } else if(data.data == RESPONSE.refuse) {
          (await this.gameGateway.findSocketOfUser(user.id)).emit('isFinished')
        }
        console.log("ende async")
    }


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
          (await this.usersService.getUserSocket(this.server, id))?.emit("Request", client.handshake.auth)
          this.friendsService.request_friendship(client.handshake.auth.id, id)
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
      this.friendsService.response_friendship(client.handshake.auth.id, id, status)
    }

    @SubscribeMessage('Remove')
    async remove(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id?: number)
    {
  		this.friendsService.remove_friendship(client.handshake.auth.id, id)
    }
}
