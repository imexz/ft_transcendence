import { Injectable } from '@nestjs/common';
import { Game } from './game.entities/game.entity';
import { Paddle } from './game.entities/paddle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket, Server } from 'socket.io';
import { GameSetup } from './game.entities/setup.entity';
import { QueueElem } from './game.interfaces/queueobj.interface'
import { UsersService } from 'src/users/users.service';
import User from 'src/users/entitys/user.entity';

@Injectable()
export class GameService {

	constructor(
		private userService: UsersService,
	){}

	setup = new GameSetup;

	@InjectRepository(Game)
	private gameRepository: Repository<Game>

	queue: Array<QueueElem> = [];
	users:  Map<string, number> = new Map<string, number>(); // Key: UserId, Value: GameId
	games = new Map<number, Game>(); // Key: GameId, Value: Game
	intervals = new Map<number, number>(); // Key: GameId, Value: IntervalId
	sockets = new Map<number, Socket[]>(); // Key: GameId, Value: Array of Sockets

	#getSideFromGame(game: Game, playerid: string): string {
		if (game.playerLeft === playerid) {
			return "left";
		} else if (game.playerRight === playerid) {
			return "right";
		} else
			return "";
	}

	checkForExistingGame(client: Socket): boolean {
		var ret: boolean = false;
		var gameid: number | undefined = this.users.get(client.handshake.auth._id.toString());
		if (gameid != undefined) {
			ret = true;
			console.log("client %d already is in users", client.handshake.auth._id);
			client.emit('gameInfo', {
					gameId: gameid,
					side: this.#getSideFromGame(this.games.get(gameid), client.handshake.auth._id.toString()),
					playerLeft: this.games.get(gameid).playerLeft,
					playerRight: this.games.get(gameid).playerRight,
				});
			client.join(gameid.toString());
		}
		else {
			console.log("no existing game available", client.handshake.auth._id);
		}
		return ret;
	}

	async	addClientIdToQueue(client: Socket, server: Server): Promise<void> {
		var needle: QueueElem = {
			id: client.handshake.auth._id.toString(),
			socket: client,
		}
		if (this.queue.find(({id}) => {return id === needle.id}) == undefined) {
			console.log("add %s to queue", client.handshake.auth._id);
			this.queue.push({id: client.handshake.auth._id.toString(), socket: client});
			while (this.queue.length > 1) {
				await this.#initializeGame(server);
			}
		} else {
			console.log("%s already is in queue", client.handshake.auth._id);
		}
	}
	
	async #initializeGame(server: Server) {
		let game: Game = await this.#createGameInstance();
		this.#updateMaps(game);
		this.#joinSocketsToDedicatedRoom(game);
		this.#emitGameInfoToFrontend(game);
		this.#startGame(server, game.id);
	}

	async #createGameInstance(): Promise<Game> {
		console.log('inside createGameInstance()');
		var gamerepo = this.gameRepository.create();
		console.log("after repo create");
		gamerepo = await this.gameRepository.save(gamerepo);
		var firstPlayer: QueueElem = this.queue.shift();
		var secondPlayer: QueueElem = this.queue.shift();
		this.sockets.set(gamerepo.id, [firstPlayer.socket, secondPlayer.socket]);
		const setup = new GameSetup;
		console.log('leaving createGameInstance()');
		return new Game(gamerepo.id, firstPlayer.socket.handshake.auth._id.toString(), secondPlayer.socket.handshake.auth._id.toString(), setup);
	}

	#updateMaps(game: Game) {
		this.games.set(game.id, game);
		this.users.set(game.playerRight, game.id);
		this.users.set(game.playerLeft, game.id);
	}

	#joinSocketsToDedicatedRoom(game: Game) {
		this.sockets.get(game.id)[0].join(game.id.toString());
		this.sockets.get(game.id)[1].join(game.id.toString());
	}

	#emitGameInfoToFrontend(game: Game) {
		this.sockets.get(game.id)[0].emit('gameInfo', {gameId: game.id, side: "left", playerLeft: game.playerLeft, playerRight: game.playerRight});
		this.sockets.get(game.id)[1].emit('gameInfo', {gameId: game.id, side: "right", playerLeft: game.playerLeft, playerRight: game.playerRight});
	}

	async #emitGameData(gameId: number, server: Server) {
		server.to(gameId.toString()).emit('updateGame', await this.getData(gameId));
	}

	async #startGame(server: Server, gameid: number) {
		var intervalId = setInterval(() => this.#emitGameData(gameid, server), 16) as unknown as number;
		this.intervals.set(gameid, intervalId);
	}

	async getData(id: number): Promise<Game | undefined> {
		if (this.games.get(id) === undefined) {
			return undefined;
		}
		this.#updateData(id);
		this.#collisionControl(id);
		if (this.#scored(id)){
			this.#reset(id);
		}
		// await this.#isGameFinished(id);
		return this.games.get(id);
	}

	#updateData(id: number) {
		let game: Game = this.games.get(id);
		game.ball.position.x += game.ball.direction.x;
		game.ball.position.y += game.ball.direction.y;
		// if (this.ball.direction.x > 0) {
		// 	if (this.ball.position.x + this.ball.radius >= 640) {
		// 		this.ball.position.x = 640 - this.ball.radius;
		// 		this.ball.direction.x *= -1;
		// 	}
		// }
		// else {
		// 	if (this.ball.position.x - this.ball.radius <= 0) {
		// 		this.ball.position.x = 0 + this.ball.radius;
		// 		this.ball.direction.x *= -1;
		// 	}

		// }
		if (game.ball.direction.y > 0) {
			if (game.ball.position.y + game.ball.radius >= 480) {
				game.ball.position.y = 480 - game.ball.radius;
				game.ball.direction.y *= -1;
			}
		}
		else {
			if (game.ball.position.y - game.ball.radius <= 0) {
				game.ball.position.y = 0 + game.ball.radius;
				game.ball.direction.y *= -1;
			}
		}
		// console.log("gameid: %d | ball: x %d, y %d", id, game.ball.position.x, game.ball.position.y);
	}

	#isBallWithinPaddleRange(id: number, paddle: Paddle): boolean {
		return (this.games.get(id).ball.position.y >= paddle.position.y &&
			this.games.get(id).ball.position.y <= paddle.position.y + paddle.height)
	}

	#isBallAtPaddle(id: number, paddle: Paddle): boolean {
		let ret: boolean = false;
		let game: Game = this.games.get(id);
		if (paddle.id == "left") {
			ret = game.ball.position.x - game.ball.radius <= paddle.position.x + paddle.width;
		} else if (paddle.id == "right") {
			ret = game.ball.position.x + game.ball.radius >= paddle.position.x;
		}
		return ret;
	}

	#calcAngle(id: number, paddle: Paddle) {
		var section: number;
		let game: Game = this.games.get(id);

		section = paddle.height / 8;
		if (this.#isBallWithinPaddleRange(id, paddle)) {
			var i: number = 1;
			while (game.ball.position.y > (paddle.position.y + i * section)) {
				i++;
			}
			game.ball.direction.angle = paddle.reboundAngles[i - 1];
		}
	}

	#updateBallDirection(id: number, paddle: Paddle) {
		this.#calcAngle(id, paddle);
		let game: Game = this.games.get(id);
		game.ball.direction.x = game.ball.direction.speed * Math.cos(game.ball.direction.angle * (Math.PI / 180));
		game.ball.direction.y = game.ball.direction.speed * Math.sin(game.ball.direction.angle * (Math.PI / 180));
	}

	#collisionControl(id: number) {
		var game: Game = this.games.get(id);
		if (game.ball.direction.x > 0) {
			if (this.#isBallAtPaddle(id, game.paddleRight) &&
				this.#isBallWithinPaddleRange(id, game.paddleRight)) {
					this.#updateBallDirection(id, game.paddleRight);
			}
		}
		else {
			if (this.#isBallAtPaddle(id, game.paddleLeft) &&
				this.#isBallWithinPaddleRange(id, game.paddleLeft)) {
					this.#updateBallDirection(id, game.paddleLeft);
			}
		}
	}

	#scored(id: number): boolean {
		var ret: boolean = false;
		let game: Game = this.games.get(id);
		if (game.ball.position.x - game.ball.radius <= 0) {
			game.score.scoreRight += game.score.increaseRight;
			game.scoreRight += game.score.increaseRight;
			ret = true;
		}
		else if (game.ball.position.x + game.ball.radius >= 640 ) {
			game.score.scoreLeft += game.score.increaseLeft;
			game.scoreLeft += game.score.increaseLeft;
			ret = true;
		}
		return ret;
	}

	#reset(id: number) {
		let game: Game = this.games.get(id);
		game.ball.position.x = this.setup.ballPos.x;
		game.ball.position.y = this.setup.ballPos.y;
		game.ball.direction.speed = this.setup.ballDir.speed;
		do {
			game.ball.direction.angle = Math.random() * 2 * Math.PI;
			game.ball.direction.x = game.ball.direction.speed * Math.cos(game.ball.direction.angle);
			game.ball.direction.y = game.ball.direction.speed * Math.sin(game.ball.direction.angle); // * 0.1
		}
		while (game.ball.direction.x < 0.2 && game.ball.direction.y < 0.2);
		// console.log("dir x: %d | dir y: %d | angle: %d", game.ball.direction.x, game.ball.direction.y, game.ball.direction.angle);
		game.ball.radius = this.setup.ballRadius;

		game.paddleLeft.width = this.setup.paddleWidth;
		game.paddleLeft.height = this.setup.paddleHeight;
		game.paddleLeft.speed = this.setup.paddleSpeed;
		game.paddleRight.width = this.setup.paddleWidth;
		game.paddleRight.height = this.setup.paddleHeight;
		game.paddleRight.speed = this.setup.paddleSpeed;

		game.score.increaseLeft = this.setup.scoreIncrease;
		game.score.increaseRight = this.setup.scoreIncrease;
	}

	async #isGameFinished(id: number) {
		var game: Game | undefined = this.games.get(id);
		if (game != undefined && game.finished) {
			// const gameEntry = this.gameRepository.create({scoreLeft: game.scoreLeft, scoreRight: game.scoreRight});
			game.player = await Promise.all([
				this.userService.getUser(game.playerLeft as unknown as number), 
				this.userService.getUser(game.playerRight as unknown as number),
				]);
			await this.gameRepository.save(game);
			clearInterval(this.intervals.get(id));
			this.intervals.delete(id);
			this.users.delete(game.playerLeft);
			this.users.delete(game.playerRight);
			this.games.delete(id);
			console.log("in isGameFinished");
			this.sockets.get(id)[0].leave(id.toString());
			this.sockets.get(id)[1].leave(id.toString());
			this.sockets.delete(id);
			game.finished = false;
			console.log("game finished, keys removed");
			// TODO: delete room (?)
			// TODO: reset frontend variables
		}
		if (game != undefined && (game.score.scoreLeft == 10 || game.score.scoreRight == 10)) {
			game.finished = true;
		}
	}

	movePaddleUp(id: number, b: boolean) {		
		let game: Game = this.games.get(id);
		if (b) {
			if (game.paddleLeft.position.y > 0)
				game.paddleLeft.position.y -= game.paddleLeft.speed;
		}
		else {
			if (game.paddleRight.position.y > 0)
				game.paddleRight.position.y -= game.paddleRight.speed;
		}
	}

	movePaddleDown(id: number, b: boolean) {
		let game: Game = this.games.get(id);
		if (b) {
			if (game.paddleLeft.position.y < (480 - game.paddleLeft.height))
				game.paddleLeft.position.y += game.paddleLeft.speed;
		}
		else {
			if (game.paddleRight.position.y < (480 - game.paddleRight.height))
				game.paddleRight.position.y += game.paddleRight.speed;
		}
	}

	leaveGame(client: Socket) {
		const userId = client.handshake.auth._id.toString();
		const gameId = this.users.get(userId);
		const game = this.games.get(gameId);

		if (userId === game.playerLeft || userId === game.playerRight) {
			// this.intervals.delete(gameId);
		} else {
			this.users.delete(userId);
			console.log("leaveGame gid", gameId, typeof gameId);
			console.log("leaveGame uid", userId, typeof userId);
			client.leave(gameId.toString());
			client.disconnect();
		}
	}

	async getMatchHistory(user: User){
	// 	return await this.gameRepository.find({ 
	// 		where: {
	// 			player: {
	// 				_id: user._id
	// 			}
	// 		},
	// 		relations: {
	// 			player: true
	// 		}
	// 	})
	// }

		return await this.gameRepository.createQueryBuilder("game")
		// .innerJoinAndSelect("game.player", "player", "player._id = :id", { id: user._id})
		.innerJoin("game.player", "tmp")
		.where("tmp._id = :te", {te: user._id})
		.innerJoinAndSelect("game.player", "player", "player._id != :id", { id: user._id})
		.getMany()
	}
}
