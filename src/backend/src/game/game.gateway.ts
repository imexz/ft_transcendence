import { SubscribeMessage, WebSocketGateway, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:8080', 'http://localhost:3000'],
		credentials: true
	},
})
export class GameGateway {

  constructor (private readonly gameService: GameService) {};

  @SubscribeMessage('checkQueue')
  handleCheckQueue(@ConnectedSocket() client: Socket) {
	  this.gameService.addClientIdToQueue(client);
  }

  @SubscribeMessage('checkGame')
  handleCheckGame(@ConnectedSocket() client: Socket): boolean {
	  return this.gameService.checkGame(client);
  }

  @SubscribeMessage('leftGame')
  handleLeftGame(@ConnectedSocket() client: Socket): void {
	this.gameService.users.delete(client.handshake.auth.id);
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
