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

  constructor (private readonly gameService: GameService) {};

  @WebSocketServer()
	server: Server;

  afterInit() { console.log("GameGateway: After init"); }

  handleConnection(@ConnectedSocket() client: Socket) { console.log("client %s connected", client.handshake.auth.id); }

  handleDisconnect(@ConnectedSocket() client: Socket) { console.log("client %s disconnected", client.handshake.auth.id); }

  @SubscribeMessage('checkQueue')
  handleCheckQueue(@ConnectedSocket() client: Socket) {
	  this.gameService.addClientIdToQueue(client, this.server);
  }

  @SubscribeMessage('checkGame')
  handleCheckGame(@ConnectedSocket() client: Socket): boolean {
	  return this.gameService.checkGame(client);
  }

  @SubscribeMessage('moveLeftUp')
  handleMoveLeftUp(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.users.get(client.handshake.auth.id);
	this.gameService.movePaddleUp(gameid, true);
  }

  @SubscribeMessage('moveRightUp')
  handleMoveRightUp(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.users.get(client.handshake.auth.id);
	this.gameService.movePaddleUp(gameid, false);
  }

  @SubscribeMessage('moveLeftDown')
  handleMoveLeftDown(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.users.get(client.handshake.auth.id);
	this.gameService.movePaddleDown(gameid, true);
  }

  @SubscribeMessage('moveRightDown')
  handleMoveRightDown(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.users.get(client.handshake.auth.id);
	this.gameService.movePaddleDown(gameid, false);
  }
}
