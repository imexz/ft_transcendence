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
import { Game, Side } from './game.entities/game.entity';
import User from 'src/users/entitys/user.entity';


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

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log("client %s disconnected", client?.handshake.auth);
  }

  @SubscribeMessage('checkGame')
  async handleCheckGame(@ConnectedSocket() client: Socket): Promise<Game> {
		var game: Game | undefined = this.gameService.getGame(client.handshake.auth._id);
		if (game == undefined) {
			// console.log("client %d already is in users", client.handshake.auth._id);
			// client.join(game.id.toString());
			console.log("no existing game available", client.handshake.auth._id);
      game = await this.gameService.JoinGameOrCreatGame(client.handshake.auth as User, this.server)
		}
    client.join(game.id.toString());
    return game
  }

  // @SubscribeMessage('checkQueue')
  // async handleCheckQueue(@ConnectedSocket() client: Socket) {
	//   // this.gameService.addClientIdToQueue(client, this.server);
  //   if(!this.gameService.getGame(client.handshake.auth._id)) {
  //     const game = await this.gameService.JoinGameOrCreatGame(client.handshake.auth as User, this.server)
  //     client.join(game.id.toString());
  //   }
  // }

  @SubscribeMessage('key')
  handleMoveLeftUp(
    @ConnectedSocket() client: Socket,
    @MessageBody() key?: string ): void {
  this.gameService.handelKeypress(client.handshake.auth._id, key)
}

@SubscribeMessage('moveRightUp')
handleMoveRightUp(@ConnectedSocket() client: Socket): void {
  let game = this.gameService.getGame(client.handshake.auth._id);
	this.gameService.movePaddleUp(game, false);
}

@SubscribeMessage('moveLeftDown')
handleMoveLeftDown(@ConnectedSocket() client: Socket): void {
  let game = this.gameService.getGame(client.handshake.auth._id);
	this.gameService.movePaddleDown(game, true);
}

@SubscribeMessage('moveRightDown')
handleMoveRightDown(@ConnectedSocket() client: Socket): void {
  let game = this.gameService.getGame(client.handshake.auth._id);
	this.gameService.movePaddleDown(game, false);
}

@SubscribeMessage('leaveGame')
handleLeaveGame(@ConnectedSocket() client: Socket): void {
    let game = this.gameService.getGame(client.handshake.auth._id);
    this.gameService.leaveGame(client.handshake.auth._id, game);
    client.leave(client.handshake.auth._id.toString())
  }

  @SubscribeMessage('Request')
  async gameRequest(
  @ConnectedSocket() client: Socket,
  @MessageBody('id') id?: number)
  {
    const game: Game = this.gameService.getGame(id)
    if(game == undefined)
    {
      this.gameService.users.set(client.handshake.auth._id.toString(), gameId);
      const socket = await this.findSocketOfUser(id)
      socket.emit("Request", {id})
    } else {
      client.join(game.id)
    }

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
