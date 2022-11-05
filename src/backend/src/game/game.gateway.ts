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
import { GameData } from './game.entities/gameData';

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
  async handleCheckGame(@ConnectedSocket() client: Socket) {
		var game: Game | undefined = this.gameService.getGame(client.handshake.auth.id);
		if (game == undefined) {
			// console.log("client %d already is in users", client.handshake.auth.id);
			console.log("no existing game available", client.handshake.auth.id);
      game = await this.gameService.joinGameOrCreateGame(client.handshake.auth as User, this.server)
      console.log("handleCheckGame");
      client.join(game.id.toString());
      this.gameService.startGame(this.server, game)
		} else if (game.playerRight != undefined) { // game is available, join existing game
      console.log("joining existing game");
      client.join(game.id.toString());
      client.emit("Game", {playerLeft: game.playerLeft, playerRight: game.playerRight})
    }
  }

  @SubscribeMessage('key')
  handleMoveLeftUp(
    @ConnectedSocket() client: Socket,
    @MessageBody() key?: string ): void {
  this.gameService.handleKeypress(client.handshake.auth.id, key)
}

@SubscribeMessage('leaveGame')
handleLeaveGame(@ConnectedSocket() client: Socket): void {
  console.log("leaveGame");
  client.rooms.forEach(element => {
    if(element != client.id)
      client.leave(element)

  });
  let game = this.gameService.getGame(client.handshake.auth.id);
  if (game != undefined && client.handshake.auth.id === game.paddleLeft.id) {
    this.gameService.removeGame(game);
  }
  // console.log(client.rooms);
  // console.log(client.id);
  
  console.log("leaveGame ende");

    // let game = this.gameService.getGame(client.handshake.auth.id);
    // this.gameService.leaveGame(client.handshake.auth.id, game);
    // client.leave()
  }

  // used for proper game request and for spectating
  @SubscribeMessage('GameRequestBackend')
  async gameRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id?: number) {

      if (client.handshake.auth.id === id) {
        client.emit('NowInGame', false)
        return undefined;
      }
      let game: Game | undefined = this.gameService.getGame(client.handshake.auth.id)
      // check if client is in a game
      if (game == undefined) {
        console.log("gameRequest: client has no game");
        game = this.gameService.getGame(id)
        // check if opponent is in a game
        if(game == undefined) {
          console.log("gameRequest: opponent has no game");
          const socket = await this.findSocketOfUser(id)
          socket.emit('GameRequestFrontend', client.handshake.auth as User)
          game = await this.gameService.joinGameOrCreateGame(client.handshake.auth as User, this.server, id)
          // client.emit('NowInGame', true)
        } else if (game.interval == null) {
          console.log("gameRequest: call startGame");
          this.gameService.startGame(this.server, game);
        }
      }
      client.join(game.id.toString());
      // client.emit('NowInGame', true)
      return {playerLeft: game.playerLeft, playerRight: game.playerRight}
  }

  @SubscribeMessage('accept')
  createGame(
    @ConnectedSocket() client: Socket,
  ) {
    var game: Game = this.gameService.getGame(client.handshake.auth.id)
    if(game != undefined && game.interval == null) {
      this.gameService.startGame(this.server, game)
      console.log("game strated");

    }
  }

  @SubscribeMessage('denied')
  async removeGame(
    @ConnectedSocket() client: Socket,
  ) {
    // player was added to the game without doing anything 
    var game: Game = this.gameService.getGame(client.handshake.auth.id)
    if(game != undefined && game.interval == null) {
      const socket = await this.findSocketOfUser(game.playerLeft.id)
      if (this.gameService.removeGame(game)) {
        socket.emit('NowInGame', false)
      }
    }
  }


  @SubscribeMessage('Quit')
  quitGame(
  @ConnectedSocket() client: Socket,
  ) {
      this.gameService.removePlayerFromWaiting(client.handshake.auth.id)
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

  async findSocketOfUser(userId: number) {
    const sockets = await this.server.fetchSockets();
    for (const socket of sockets) {
      if(socket.handshake.auth.id == userId)
      {
        // console.log("gameRequest test");
        return socket
      }
    }
  }
}
