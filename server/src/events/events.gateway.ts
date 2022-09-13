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

  @SubscribeMessage('event')
  handleEvent(): void {
	console.log("handleMessage called");
	// this.server.emit('events', this.gameService.getPosition());
  }
}
