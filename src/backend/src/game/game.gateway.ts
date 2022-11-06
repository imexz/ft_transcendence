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
import { forwardRef, Injectable, Inject } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'game',
	cors: {
		origin: [hostURL + ':8080', hostURL +':3000'],
		credentials: true
	},
})
@Injectable()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor (
	  @Inject(forwardRef(() => GameService))
	  private readonly gameService: GameService,
	  @Inject(forwardRef(() => AuthService))
	  private authService: AuthService,
	) {};

  @WebSocketServer()
	server: Server;

  afterInit() { console.log("GameGateway: After init"); }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    console.log("client %s connected", socket?.handshake.auth.id);
	this.authService.validateSocket(socket)
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log("client %s disconnected", client?.handshake.auth.id);
  }

  @SubscribeMessage('isInGame')
  async handleIsInGame(@ConnectedSocket() client: Socket) {
	console.log("isInGame start", client.rooms);
	var game: Game | undefined = this.gameService.getGame(client.handshake.auth.id);
	if (game == undefined) {
		console.log("no existing game available", client.handshake.auth.id);
      	game = await this.gameService.joinGameOrCreateGame(client.handshake.auth as User, this.server)
      	client.join(game.id.toString());
      	this.gameService.startGame(this.server, game)
	} else if (game.playerRight != undefined) { // game is available, join existing game
      	console.log("joining existing game");
      	client.join(game.id.toString());
      	client.emit('GameInfo', {playerLeft: game.playerLeft, playerRight: game.playerRight})
    }
	console.log("isInGame end", client.rooms);
  }

  // used for proper game request and for spectating
  @SubscribeMessage('GameRequestBackend')
  async gameRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id?: number) {

	const clientId: number = client.handshake.auth.id;
	if (clientId === id) {
		client.emit('NowInGame', false)
		return undefined;
	}
	let game: Game | undefined = this.gameService.getGame(clientId)
	// check if client is in a game
	if (game == undefined) {
		console.log("gameRequest: client has no game");
		game = this.gameService.getGame(id);
		// check if opponent is in a game
		if(game == undefined) {
			console.log("gameRequest: opponent has no game");
			const socket = await this.findSocketOfUser(id)
			socket.emit('GameRequestFrontend', client.handshake.auth as User)
			game = await this.gameService.joinGameOrCreateGame(client.handshake.auth as User, this.server, id)
			// client.emit('NowInGame', true)
		} else { // opponent is playing
			const isPlayer: boolean = clientId === game.playerLeft.id || clientId === game.playerRight.id;
			if (isPlayer && game.interval == null) {
				console.log("gameRequest: call startGame");
				this.gameService.startGame(this.server, game);
			}
		}
	}
	// console.log(client.rooms);
	client.join(game.id.toString());
	// console.log(client.rooms);
	// client.emit('NowInGame', true)
	return {playerLeft: game.playerLeft, playerRight: game.playerRight}
  }

  @SubscribeMessage('accept')
  handleAcceptGameRequest(
    @ConnectedSocket() client: Socket,
  ) {
    var game: Game = this.gameService.getGame(client.handshake.auth.id)
    if(game != undefined && game.interval == null) {
      this.gameService.startGame(this.server, game)
    }
  }

  @SubscribeMessage('denied')
  async handleDenyGameRequest(@ConnectedSocket() client: Socket) {
    // player was added to the game without doing anything
    var game: Game = this.gameService.getGame(client.handshake.auth.id)
    if(game != undefined && game.interval == null) {
    	const socket = await this.findSocketOfUser(game.playerLeft.id)
		this.leaveRoom(game.id.toString())
		if (this.gameService.removeGame(game)) {
    		socket.emit('NowInGame', false)
    	}
    }
  }

  @SubscribeMessage('quitPendingGame')
  quitPendingGame(@ConnectedSocket() client: Socket) {
      this.gameService.removePendingGame(client.handshake.auth.id)
  }

  leaveRoom(roomId: string) {
	  console.log("closing room", roomId);
	  this.server.in(roomId).socketsLeave(roomId);
  }

  @SubscribeMessage('leaveGame')
  handleLeaveGame(@ConnectedSocket() client: Socket): void {
	console.log("leaveGame");
	client.rooms.forEach(element => {
	//   if(element != client.id)
		client.leave(element)
	});
	let game = this.gameService.getGame(client.handshake.auth.id);
	if (game != undefined && client.handshake.auth.id === game.playerLeft.id) {
	  this.gameService.removeGame(game);
	}
	console.log("leaveGame ende");
  }

  @SubscribeMessage('ViewGame')
  async viewRequest(
  @ConnectedSocket() client: Socket,
  @MessageBody('id') id?: number)
  {
    const game: Game = this.gameService.getGame(id)
    if(game != undefined) {
      client.join(game.id.toString())
    }
    return {playerLeft: game.playerLeft, playerRight: game.playerRight}
  }

  @SubscribeMessage('key')
  handleKey(
    @ConnectedSocket() client: Socket,
    @MessageBody() key?: string): void {
  	this.gameService.handleKeypress(client.handshake.auth.id, key)
  }

  async findSocketOfUser(userId: number) {
    const sockets = await this.server.fetchSockets();
    for (const socket of sockets) {
      if(socket.handshake.auth.id == userId) {
        return socket
      }
    }
  }
}
