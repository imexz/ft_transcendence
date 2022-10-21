import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { hostURL } from 'src/hostURL';
import { Socket, Server } from 'socket.io';
import { JwtStrategy } from 'src/auth/jwt-two/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import  { UserStatus }  from "./users/entitys/status.enum";
import { UsersService } from './users/users.service';
import { RequestEnum } from './request.enum';
import { GameService } from './game/game.service';





@WebSocketGateway({
    cors: {
      // origin: "*",
      origin: [hostURL + ':8080', hostURL + ':3000'],
      credentials: true
    }
})

export class AppGateway {

  constructor(  private jwtService: JwtService,
                private jwtStrategy: JwtStrategy,
                private usersService: UsersService,
                private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

    async handleConnection(socket) {
      
      
      try {
        socket.handshake.auth = this.jwtService.verify(socket.handshake.auth.id.replace('Authentication=',''));
        console.log("socket handshake");
        console.log(socket.handshake.auth);
        
        socket.handshake.auth = await this.jwtStrategy.validate(socket.handshake.auth)
        console.log("socket handshake1");
        console.log(socket.handshake.auth);
        if(socket.handshake.auth == undefined){
          console.log("validation goes wrong");
          socket.disconnect()
          return
        }
        console.log('====connected chat====', socket.handshake.auth._id);
        this.usersService.setStatus(socket.handshake.auth._id, UserStatus.ONLINE)
        } catch (error) {
          console.log("wrong token");
          socket.disconnect()
          return
        }
      }
      
    async handleDisconnect(socket) {
      console.log("disconnected", socket.handshake.auth);
      
      this.usersService.setStatus(socket.handshake.auth._id, UserStatus.OFFLINE)
    }


    @SubscribeMessage('typing')
    test(){
      console.log("typing wrong ");
      
    }

    @SubscribeMessage('Request')
    async gameRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id?: number,
    @MessageBody('type') type?: RequestEnum    )
    {
      console.log("Request to", id," type =", type);
      
      switch (type) {
        case RequestEnum.GAME:
          const gameId: number = this.gameService.users.get(id.toString());
          if(gameId != undefined)
          {
            this.gameService.users.set(client.handshake.auth._id.toString(), gameId);          
            break;
          }
        case RequestEnum.FRIENDSHIP:
          
          // break;
        default:
          const sockets = await this.server.fetchSockets();
          for (const socket of sockets) {
            // console.log(socket.handshake.auth._id);
            // console.log(typeof socket.handshake.auth._id);
            // console.log(typeof id);
            if(socket.handshake.auth._id == id)
            {
              console.log("gameRequest test");
              socket.emit("Request", {id, type})
            }
          }
          break;
      }
    }
}