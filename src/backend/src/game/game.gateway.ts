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

  afterInit(socket) {
	console.log("afterInit game ");
  }

  handleConnection(socket) {

	console.log(socket.handshake.auth.id );

	console.log('connected game')

	// socket.emit('successfullConnected');
  }

  @SubscribeMessage('joinQueue')
  async handleJoinQueue(@ConnectedSocket() client: Socket): Promise<void> {
	this.gameService.addClientIdToQueue(client);
	if (this.gameService.gameIds.has(client.handshake.auth.id) == false) {
		console.log("client id %s is not in gamesIds Array", client.handshake.auth.id);
		while (this.gameService.queue.length > 1) {
			await this.gameService.createGame();
			if (this.gameService.queue)
				console.log(this.gameService.queue.length);
			else
				console.log("queue empty");
		}
		console.log("after loop");
	}

  }

//   @SubscribeMessage('joinedGame')
//   handleJoinedGame(gameid: number, @ConnectedSocket() client: Socket): void {
// 	this.gameService.gameIds.set(client.handshake.auth.id, gameid);
//   }

  @SubscribeMessage('leftGame')
  handleLeftGame(@ConnectedSocket() client: Socket): void {
	this.gameService.gameIds.delete(client.handshake.auth.id);
  }

  @SubscribeMessage('moveLeftUp')
  handleMoveLeftUp(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.gameIds.get(client.handshake.auth.id);
	this.gameService.movePaddleUp(gameid, true);
  }
  @SubscribeMessage('moveRightUp')
  handleMoveRightUp(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.gameIds.get(client.handshake.auth.id);
	this.gameService.movePaddleUp(gameid, false);
  }


  @SubscribeMessage('moveLeftDown')
  handleMoveLeftDown(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.gameIds.get(client.handshake.auth.id);
	this.gameService.movePaddleDown(gameid, true);
  }

  @SubscribeMessage('moveRightDown')
  handleMoveRightDown(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.gameIds.get(client.handshake.auth.id);
	this.gameService.movePaddleDown(gameid, false);
  }
}
