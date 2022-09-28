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

//   @SubscribeMessage('joinQueue')
//   async handleJoinQueue(@ConnectedSocket() client: Socket): Promise<void> {
// 	console.log("inside handleJoinQueue");
// 	this.gameService.addClientIdToQueue(client);
// 	if (this.gameService.mapIds.has(client.handshake.auth.id) == false) {
// 		console.log("client id %s is not in gamesIds Array", client.handshake.auth.id);
// 		while (this.gameService.queue.length > 1) {
// 			await this.gameService.createGame();
// 		}
// 	}
// 	else {
// 		console.log("client %d already in mapIds", client.handshake.auth.id);
// 	}
// 	console.log("leaving handleJoinQueue");
//   }
  @SubscribeMessage('joinQueue')
  handleJoinQueue(@ConnectedSocket() client: Socket) {
	this.gameService.addClientIdToQueue(client);
  }

  @SubscribeMessage('checkGame')
  async handleCheckGame(@ConnectedSocket() client: Socket): Promise<void> {
	await this.gameService.checkQueueForGame(client);
  }

  @SubscribeMessage('leftGame')
  handleLeftGame(@ConnectedSocket() client: Socket): void {
	this.gameService.mapIds.delete(client.handshake.auth.id);
  }

  @SubscribeMessage('moveLeftUp')
  handleMoveLeftUp(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.mapIds.get(client.handshake.auth.id);
	this.gameService.movePaddleUp(gameid, true);
  }
  @SubscribeMessage('moveRightUp')
  handleMoveRightUp(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.mapIds.get(client.handshake.auth.id);
	this.gameService.movePaddleUp(gameid, false);
  }


  @SubscribeMessage('moveLeftDown')
  handleMoveLeftDown(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.mapIds.get(client.handshake.auth.id);
	this.gameService.movePaddleDown(gameid, true);
  }

  @SubscribeMessage('moveRightDown')
  handleMoveRightDown(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.mapIds.get(client.handshake.auth.id);
	this.gameService.movePaddleDown(gameid, false);
  }
}
