import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { hostURL } from 'src/hostURL';
import { Socket, Server } from 'socket.io';
import { JwtStrategy } from 'src/auth/jwt-two/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import  { UserStatus }  from "./users/entitys/status.enum";
import { UsersService } from './users/users.service';
import { RequestEnum } from './request.enum';





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
                private usersService: UsersService) {}

  @WebSocketServer()
  server: Server;

    async handleConnection(socket) {
        console.log('====connected chat====')
        console.log(socket.handshake);
    
    
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
          this.usersService.setStatus(socket.handshake.auth._id, UserStatus.ONLINE)
        } catch (error) {
          console.log("wrong token");
          socket.disconnect()
          return
        }
      }
      
    async handleDisconnect(socket) {
      console.log(socket.handshake.auth);
      
      this.usersService.setStatus(socket.handshake.auth._id, UserStatus.OFFLINE)
    }

    @SubscribeMessage('Request')
    async gameRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id?: number,
    @MessageBody('type') type?: RequestEnum    )
    {
        console.log("gameRequest");
        // console.log(client);
        // const test = Object.keys(this.server.sockets)
        // console.log(test);
        // console.log(client.fetchSockets());
        // console.log(await this.server.fetchSockets());

        const sockets = await this.server.fetchSockets();


        for (const socket of sockets) {
          console.log(socket.handshake.auth._id);
          console.log(typeof socket.handshake.auth._id);
          console.log(typeof id);
          
          
          if(socket.handshake.auth._id == id)
          {
            console.log("gameRequest test");
            socket.emit("Request", {id, type})
            
          }

        }
        
    }
}