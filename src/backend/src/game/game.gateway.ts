import { SubscribeMessage, WebSocketGateway, ConnectedSocket } from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket, Server } from 'socket.io';


@WebSocketGateway({
	cors: {
		// origin: '*',
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true
	},
  // namespace: 'game'
})
export class GameGateway {
  // @WebSocketServer()
  // server: Server;

  constructor (private readonly gameService: GameService) {};

  afterInit(socket) {
    console.log("afterInit game ");
    
  }

  handleConnection(socket) {

    console.log(socket.id );
    
    console.log('connected game')

    // socket.emit('successfullConnected');
  }

  @SubscribeMessage('moveLeftUp')
  handleMoveLeftUp(): void {
	this.gameService.movePaddleUp(true);
  
  }
  @SubscribeMessage('moveRightUp')
  handleMoveRightUp(@ConnectedSocket() client: Socket): void {
    console.log(client.id);
    
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
