import { SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
 } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket, Server } from 'socket.io';
import { hostURL } from 'src/hostURL';
import { AuthService } from 'src/auth/auth.service';


@WebSocketGateway({
  namespace: 'game',
	cors: {
		origin: [hostURL + ':8080', hostURL +':3000'],
		credentials: true
	},
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor (private readonly gameService: GameService, private authService: AuthService) {};

  @WebSocketServer()
	server: Server;

  afterInit() { console.log("GameGateway: After init"); }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    this.authService.validateSocket(socket)
  }

  handleDisconnect(@ConnectedSocket() client: Socket) { console.log("client %s disconnected", client?.handshake.auth._id); }

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
	let gameid = this.gameService.users.get(client.handshake.auth._id.toString());
	this.gameService.movePaddleUp(gameid, true);
  }

  @SubscribeMessage('moveRightUp')
  handleMoveRightUp(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.users.get(client.handshake.auth._id.toString());
	this.gameService.movePaddleUp(gameid, false);
  }

  @SubscribeMessage('moveLeftDown')
  handleMoveLeftDown(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.users.get(client.handshake.auth._id.toString());
	this.gameService.movePaddleDown(gameid, true);
  }

  @SubscribeMessage('moveRightDown')
  handleMoveRightDown(@ConnectedSocket() client: Socket): void {
	let gameid = this.gameService.users.get(client.handshake.auth._id.toString());
	this.gameService.movePaddleDown(gameid, false);
  }

  @SubscribeMessage('leaveGame')
  handleLeaveGame(@ConnectedSocket() client: Socket): void {
    this.gameService.leaveGame(client);
  }

  @SubscribeMessage('Request')
  async gameRequest(
  @ConnectedSocket() client: Socket,
  @MessageBody('id') id?: number)
  {
    const gameId: number = this.gameService.users.get(id.toString());
    if(gameId != undefined)
    {
      this.gameService.users.set(client.handshake.auth._id.toString(), gameId);
    }
    const socket = await this.findSocketOfUser(id)
    socket.emit("Request", {id})

  }
  
    async findSocketOfUser(userId: number) {
      const sockets = await this.server.fetchSockets();
      for (const socket of sockets) {
        if(socket.handshake.auth._id == userId)
        {
          console.log("gameRequest test");
          return socket
        }
      }
    }
}
