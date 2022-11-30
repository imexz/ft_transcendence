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
import { Game } from './game.entities/game.entity';
import User from 'src/users/entitys/user.entity';
import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { Settings } from './game.entities/settings';
import {Gateway} from '../users/friends/friend.gateway'

@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: [hostURL + ':8080'],
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
		@Inject(forwardRef(() => Gateway))
		private gateway: Gateway,
	) {}

  @WebSocketServer()
	server: Server

  afterInit() { console.log("GameGateway: After init") }

  async handleConnection(@ConnectedSocket() socket: Socket) {
	console.log("client %s connected", socket?.handshake.auth.id)
	if(await this.authService.validateSocket(socket)) {
		const game = this.getGame(socket.handshake.auth.id)
			this.joinGameRoom(socket, game)
	}
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
	console.log("client %s disconnected", client?.handshake.auth?.id)
  }

  async joinGameRoom(client: Socket | any, game: Game) {
	if(game != undefined && client != undefined) {
		client.join(game.id.toString())
		if (game.interval == null) {
			if (client.handshake.auth.id === game.loser?.id) {
				client.emit('resetRequester')
				await this.gameService.startGame(this.server, game)
			}
		} else {
			client.emit('GameInfo', {winner: game.winner, loser: game.loser})
		}
		this.sendPaddle(client, game)
	}
  }

  async sendPaddle(client: Socket, game: Game) {
  	await new Promise( resolve => setTimeout(resolve, 100) )
  	client.emit('updatePaddle', {paddleLeft: game?.paddleLeft, paddleRight: game?.paddleRight})
  	client.emit('updateScore', {scoreWinner: game.score.scoreLeft, scoreLoser: game.score.scoreRight})
  }

  getGame(userId: number): Game {
  	const game = this.gameService.getGame(userId)
  	return  game ? game : this.gameService.getSpectatedGame(userId)
  }

  @SubscribeMessage('joinOrCreatGame')
  async handleIsInGame(
	@ConnectedSocket() client: Socket,
  	@MessageBody('settings') settings: Settings
  ) {
		var game = this.getGame(client.handshake.auth.id)
		if (game == undefined) {
			game = await this.gameService.joinGameOrCreateGame(client.handshake.auth as User, settings)
		}
		await this.joinGameRoom(client, game)
		console.log("isInGame end", client.rooms)
	}

  @SubscribeMessage('GameRequestBackend')
  async handleGameRequest(
	@ConnectedSocket() client: Socket,
	@MessageBody('settings') settings: Settings,
	@MessageBody('id') id?: number,
  ) {
		console.log("settings", settings)
		const clientId: number = client.handshake.auth.id
		let game: Game | undefined = this.gameService.getGame(clientId)
		if (game != undefined) {
			console.log("gameRequest: client has a game. Reject request")
			return false // client in game -> no push
		} else {
			console.log("gameRequest: client has no game")
			game = this.gameService.getGame(id)
			if(game == undefined) {
				console.log("gameRequest: opponent has no game")
				const socket = await this.gateway.askUserToPlay(client.handshake.auth as User, id, settings)
				return true
			} else {
				console.log("gameRequest: invited player has game. Specatating.")
				client.rooms.forEach(roomId => { if (client.id != roomId) client.leave(roomId) })
			}
		}
		console.log("gameRequest end")
		return true
  }

  closeRoom(roomId: string) {
	console.log("closing room", roomId)
	this.server.in(roomId).socketsLeave(roomId)
  }

  // emittable bywinner  (while game is pending) and spectator
  @SubscribeMessage('leaveGame')
  async handleLeaveGame(@ConnectedSocket() client: Socket) {
	console.log("leaveGame")
	const clientId: number = client.handshake.auth.id
	client.rooms.forEach(roomId => { if (client.id != roomId) client.leave(roomId) })
	let game = this.gameService.getSpectatedGame(clientId)
	this.gameService.removeUserFromSpectators(clientId, game)
	game = this.gameService.getGame(clientId)
	if (game == undefined) return
	const isMatchDeletable: boolean = clientId === game.winner.id && game.interval == null
	if (isMatchDeletable) {
		if (game.loser != undefined) {
			const socket = await this.findSocketOfUser(game.loser.id)
			if (socket != undefined)
				socket.emit('resetRequester')
		}
		game.spectators.forEach(async (element: number) =>  {
			const socket = await this.findSocketOfUser(element)
			if (socket)
				socket.emit('NowInGame', false)
		})
		this.closeRoom(game.id.toString())
		this.gameService.removeGame(game)
	}
	console.log("leaveGame ende")
  }

  async viewRequest(userId: number, gameId: number ) {
	if(gameId != undefined) {
		this.gameService.addUserToSpectators(userId, gameId)
		const socket = await this.findSocketOfUser(userId)
		if(socket) {
			const game = this.getGame(userId)
			this.joinGameRoom(socket, game)
		}
	}
  }

  @SubscribeMessage('key')
  handleKey(
	@ConnectedSocket() client: Socket,
	@MessageBody() key?: string
  ) {
		this.gameService.handleKeypress(client.handshake.auth.id, key)
  }

  async findSocketOfUser(userId: number) {
	const sockets = await this.server.fetchSockets();
	for (const socket of sockets) {
		if (socket.handshake.auth.id == userId) {
			return socket
		}
	}
	return undefined
  }
}
