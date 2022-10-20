import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { hostURL } from 'src/hostURL';
import { Socket, Server } from 'socket.io';
import { JwtStrategy } from 'src/auth/jwt-two/jwt.strategy';
import { JwtService } from '@nestjs/jwt';



@WebSocketGateway({
    cors: {
      // origin: "*",
      origin: [hostURL + ':8080', hostURL + ':3000'],
      credentials: true
    }
})

export class AppGateway {


  constructor( private jwtService: JwtService, private jwtStrategy: JwtStrategy) {}

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
        } catch (error) {
          console.log("wrong token");
          socket.disconnect()
          return
        }
      }

    @SubscribeMessage('gameRequest')
    async gameRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id?: number,)
    {
        console.log("gameRequest");
        console.log(client);
        client.clients()
        
        
    }
}