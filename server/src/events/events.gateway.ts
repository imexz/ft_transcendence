import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { GameService } from 'src/game/game.service';
import { Server } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor (private readonly gameService: GameService) {};

  @SubscribeMessage('moveLeftUp')
  handleMoveLeftUp(): void {
	this.gameService.movePaddleUp(true);
  }
  @SubscribeMessage('moveRightUp')
  handleMoveRightUp(): void {
	this.gameService.movePaddleUp(false);
  }

  @SubscribeMessage('moveLeftDown')
  handleMoveLeftDown(): void {
	this.gameService.movePaddleDown(true);
  }
  @SubscribeMessage('moveRightDown')
  handleMoveRightDown(): void {
	this.gameService.movePaddleDown(false);
  }
}
