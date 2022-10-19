import { SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket, Server } from 'socket.io';
import { Game } from './game.entities/game.entity';
import { Observable, map, interval } from 'rxjs';
import { hostURL } from 'src/hostURL';
import { JwtStrategy } from 'src/auth/jwt-two/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'src/auth/tokenPayload.interface';


interface GameEvent {
  data: Game;
}

@WebSocketGateway({
  namespace: 'game',
	cors: {
		origin: [hostURL + ':8080', hostURL +':3000'],
		credentials: true
	},
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor (private readonly gameService: GameService, private jwtService: JwtService, private jwtStrategy: JwtStrategy) {};

  @WebSocketServer()
	server: Server;

  afterInit() { console.log("GameGateway: After init"); }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    // console.log("client %s connected", client.handshake.auth.id);
    try {
      socket.handshake.auth  = this.jwtService.verify(socket.handshake.auth.id.replace('Authentication=',''));
      console.log("socket handshake");
      console.log(socket.handshake.auth);

      socket.handshake.auth = await this.jwtStrategy.validate(socket.handshake.auth as TokenPayload)
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

  handleDisconnect(@ConnectedSocket() client: Socket) { console.log("client %s disconnected", client.handshake.auth._id); }

  @SubscribeMessage('checkGame')
  handleCheckGame(@ConnectedSocket() client: Socket): boolean {
    return this.gameService.checkForExistingGame(client);
  }

  @SubscribeMessage('checkQueue')
  handleCheckQueue(@ConnectedSocket() client: Socket) {
	  this.gameService.addClientIdToQueue(client, this.server);
  }

  @SubscribeMessage('moveLeftUp')
  handleMoveLeftUp(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.users.get(client.handshake.auth._id);
	this.gameService.movePaddleUp(gameid, true);
  }

  @SubscribeMessage('moveRightUp')
  handleMoveRightUp(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.users.get(client.handshake.auth._id);
	this.gameService.movePaddleUp(gameid, false);
  }

  @SubscribeMessage('moveLeftDown')
  handleMoveLeftDown(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.users.get(client.handshake.auth._id);
	this.gameService.movePaddleDown(gameid, true);
  }

  @SubscribeMessage('moveRightDown')
  handleMoveRightDown(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.users.get(client.handshake.auth._id);
	this.gameService.movePaddleDown(gameid, false);
  }
}
