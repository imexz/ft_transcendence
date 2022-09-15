import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { GameService } from '../game/game.service';
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
    console.log("moveLeftUp");
    
	this.gameService.movePaddleUp(true);
  }
  @SubscribeMessage('moveRightUp')
  handleMoveRightUp(): void {
    console.log("moveRightUp");
	this.gameService.movePaddleUp(false);
  }
  

  @SubscribeMessage('moveLeftDown')
  handleMoveLeftDown(): void {
    console.log("moveLeftDown");
	this.gameService.movePaddleDown(true);
  }

  @SubscribeMessage('moveRightDown')
  handleMoveRightDown(): void {
    console.log("moveLeftDown");
	this.gameService.movePaddleDown(false);
  }
}
