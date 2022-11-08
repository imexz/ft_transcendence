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
import { GamePlayer } from './game.interfaces/gameplayer.interface';

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

  isSpectating(clientId: number): Game | undefined {
	return this.gameService.getSpectatedGame(clientId);
  }

  joinGameRoom(client: Socket, game: Game) {
	console.log("joining existing gameRoom");
    client.join(game.id.toString());
	if (game.interval == null) {
		if (client.handshake.auth.id === game.playerRight?.id)
			this.gameService.startGame(this.server, game);
	} else {
		client.emit('GameInfo', {playerLeft: game.playerLeft, playerRight: game.playerRight})
	}
  }

  @SubscribeMessage('isInGame')
  async handleIsInGame(@ConnectedSocket() client: Socket) {
	var game: Game | undefined
	const clientId: number = client.handshake.auth.id;

	console.log("isInGame start", client.rooms);
	game = this.gameService.getGame(clientId);
	if (game == undefined) {
		game = this.isSpectating(clientId);
		if (game == undefined) {
			console.log("no existing game for client available", clientId);
			game = await this.gameService.joinGameOrCreateGame(client.handshake.auth as User, this.server)
		} else {
			console.log("client is spectating");
		}
	} else {
		console.log("client is playing");
	}
	this.joinGameRoom(client, game);
	console.log("isInGame end", client.rooms);
  }

  // used for proper game request and for spectating
  @SubscribeMessage('GameRequestBackend')
  async gameRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id?: number) {

	let ret: undefined | GamePlayer;
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
		// check if opponent (id) is in a game
		if(game == undefined) {
			console.log("gameRequest: opponent has no game");
			const socket = await this.findSocketOfUser(id)
			// set frontend var gameRequest as User who wants to play
			socket.emit('GameRequestFrontend', client.handshake.auth as User)
			game = await this.gameService.joinGameOrCreateGame(client.handshake.auth as User, this.server, id)
			// client.emit('NowInGame', true) --> pushes to /play
		} else { // opponent is playing
			const isPlayer: boolean = clientId === game.playerLeft.id || clientId === game.playerRight.id;
			if (isPlayer && game.interval == null) {
				console.log("gameRequest: call startGame");
				this.gameService.startGame(this.server, game);
				this.server.to(game.id.toString()).emit('canceled')
			} else if (!isPlayer) {
				this.gameService.addUserToSpectators(clientId, game);
			}
		}
		ret = {playerLeft: game.playerLeft, playerRight: game.playerRight}
	} else {
		console.log("client has game");
		ret = undefined
		// this.gameService.startGame(this.server, game);
	}
	client.join(game.id.toString());
	// client.emit('NowInGame', true)
	// return {playerLeft: game.playerLeft, playerRight: game.playerRight}
	return ret
  }

  @SubscribeMessage('accept')
  async handleAcceptGameRequest(
    @ConnectedSocket() client: Socket,
  ) {
    var game: Game = this.gameService.getGame(client.handshake.auth.id)
    if(game != undefined && game.interval == null) {
		console.log('accept');
	  let socket = await this.findSocketOfUser(game.playerLeft.id)
	  socket.emit('NowInGame', true)
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
  async handleLeaveGame(@ConnectedSocket() client: Socket) {
	console.log("leaveGame");
	console.log(client.rooms);
	client.rooms.forEach(element => {
	//   if(element != client.id)
		client.leave(element)
	});
	console.log(client.rooms);
	let game = this.gameService.getGame(client.handshake.auth.id);
	if (game != undefined && client.handshake.auth.id === game.playerLeft.id) {
		if (game.playerRight != undefined) {
			const socket = await this.findSocketOfUser(game.playerRight.id)
			socket.emit('canceled')
		}
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
