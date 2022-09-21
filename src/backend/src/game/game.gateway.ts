import { SubscribeMessage, WebSocketGateway, ConnectedSocket } from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor (private readonly gameService: GameService) {};

  @SubscribeMessage('joinQueue')
  async handleJoinQueue(@ConnectedSocket() client: Socket): Promise<void> {
	console.log("%s joined queue" , client.id);
	this.gameService.addClientIdToQueue(client);
	console.log("Queue length is: %d", this.gameService.queue.length);
	if (this.gameService.gameIds.has(client.id) == false) {
		console.log("client id %s is not in gamesIds Array", client.id);
		while (this.gameService.queue.length > 1) {
			await this.gameService.createGame();
			if (this.gameService.queue)
				console.log(this.gameService.queue.length);
			else
				console.log("queue empty");
		}
	}

  }

//   @SubscribeMessage('joinedGame')
//   handleJoinedGame(gameid: number, @ConnectedSocket() client: Socket): void {
// 	this.gameService.gameIds.set(client.id, gameid);
//   }

  @SubscribeMessage('leftGame')
  handleLeftGame(@ConnectedSocket() client: Socket): void {
	this.gameService.gameIds.delete(client.id);
  }

  @SubscribeMessage('moveLeftUp')
  handleMoveLeftUp(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.gameIds.get(client.id);
	this.gameService.movePaddleUp(gameid, true);
  }
  @SubscribeMessage('moveRightUp')
  handleMoveRightUp(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.gameIds.get(client.id);
	this.gameService.movePaddleUp(gameid, false);
  }


  @SubscribeMessage('moveLeftDown')
  handleMoveLeftDown(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.gameIds.get(client.id);
	this.gameService.movePaddleDown(gameid, true);
  }

  @SubscribeMessage('moveRightDown')
  handleMoveRightDown(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.gameIds.get(client.id);
	this.gameService.movePaddleDown(gameid, false);
  }
}
