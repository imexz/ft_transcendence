import { Injectable } from '@nestjs/common';
import { Game } from './game.entities/game.entity';
import { Paddle } from './game.entities/paddle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket, Server } from 'socket.io';
import { GameSetup } from './game.entities/setup.entity';
import { QueueElem } from './game.interfaces/queueobj.interface'

@Injectable()
export class GameService {

	setup = new GameSetup;

	@InjectRepository(Game)
	private gameRepository: Repository<Game>

	queue: Array<QueueElem> = [];
	users = new Map<string, number>(); // Key: UserId, Value: GameId
	games = new Map<number, Game>(); // Key: GameId, Value: Game
	intervals = new Map<number, number>(); // Key: GameId, Value: IntervalId
	sockets = new Map<number, Socket[]>();

	#getSideFromGame(game: Game, playerid: string): string {
		if (game.playerLeft === playerid) {
			return "left";
		} else if (game.playerRight === playerid) {
			return "right";
		} else
			return "";
	}

	checkGame(client: Socket): boolean {
		var ret: boolean = false;
		var gameid = this.users.get(client.handshake.auth.id);
		if (gameid != undefined) {
			ret = true;
			console.log("client %d already is in users", client.handshake.auth.id);
			client.emit('gameInfo', {
					gameId: gameid,
					side: this.#getSideFromGame(this.games.get(gameid), client.handshake.auth.id),
				});
			client.join(gameid.toString());
		}
		return ret;
	}

	async	addClientIdToQueue(client: Socket, server: Server): Promise<void> {
		var needle: QueueElem = {
			id: client.handshake.auth.id,
			socket: client,
		}
		console.log(this.queue);
		if (this.queue.find(({id}) => {return id === needle.id}) == undefined) {
			console.log("add %s to queue", client.handshake.auth.id);
			this.queue.push({id: client.handshake.auth.id, socket: client});
			while (this.queue.length > 1) {
				await this.#initializeGame(server);			
			}
		} else {
			console.log("%s already is in queue", client.handshake.auth.id);
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
		return new Game(gamerepo.id, firstPlayer.socket.handshake.auth.id, secondPlayer.socket.handshake.auth.id, setup);
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
		this.sockets.get(game.id)[0].emit('gameInfo', {gameId: game.id, side: "left"});
		this.sockets.get(game.id)[1].emit('gameInfo', {gameId: game.id, side: "right"});
	}

	#emitGameData(gameId: number, server: Server) {
		server.to(gameId.toString()).emit('updateGame', this.getData(gameId));
	}

	#startGame(server: Server, gameid: number) {
		var intervalId = setInterval(() => this.#emitGameData(gameid, server), 10) as unknown as number;
		this.intervals.set(gameid, intervalId);
	}

	getData(id: number): Game | undefined {
		if (this.games.get(id) === undefined) {
			return undefined;
		}
		this.#updateData(id);
		this.#collisionControl(id);
		if (this.#scored(id)){
			this.#reset(id);
		}
		this.#isGameFinished(id);
		return this.games.get(id);
	}

	#updateData(id: number) {
		this.games.get(id).ball.position.x += this.games.get(id).ball.direction.x;
		this.games.get(id).ball.position.y += this.games.get(id).ball.direction.y;
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
		if (this.games.get(id).ball.direction.y > 0) {
			if (this.games.get(id).ball.position.y + this.games.get(id).ball.radius >= 480) {
				this.games.get(id).ball.position.y = 480 - this.games.get(id).ball.radius;
				this.games.get(id).ball.direction.y *= -1;
			}
		}
		else {
			if (this.games.get(id).ball.position.y - this.games.get(id).ball.radius <= 0) {
				this.games.get(id).ball.position.y = 0 + this.games.get(id).ball.radius;
				this.games.get(id).ball.direction.y *= -1;
			}
		}
		// console.log("gameid: %d | ball: x %d, y %d", id, this.games.get(id).ball.position.x, this.games.get(id).ball.position.y);
	}

	#isBallWithinPaddleRange(id: number, paddle: Paddle): boolean {
		return (this.games.get(id).ball.position.y >= paddle.position.y &&
			this.games.get(id).ball.position.y <= paddle.position.y + paddle.height)
	}

	#isBallAtPaddle(id: number, paddle: Paddle): boolean {
		let ret: boolean = false;
		if (paddle.id == "left") {
			ret = this.games.get(id).ball.position.x - this.games.get(id).ball.radius <= paddle.position.x + paddle.width;
		} else if (paddle.id == "right") {
			ret = this.games.get(id).ball.position.x + this.games.get(id).ball.radius >= paddle.position.x;
		}
		return ret;
	}

	#calcAngle(id: number, paddle: Paddle) {
		var section: number;

		section = paddle.height / 8;
		if (this.#isBallWithinPaddleRange(id, paddle)) {
			var i: number = 1;
			while (this.games.get(id).ball.position.y > (paddle.position.y + i * section)) {
				i++;
			}
			this.games.get(id).ball.direction.angle = paddle.reboundAngles[i - 1];
		}
	}

	#updateBallDirection(id: number, paddle: Paddle) {
		this.#calcAngle(id, paddle);
		this.games.get(id).ball.direction.x = this.games.get(id).ball.direction.speed * Math.cos(this.games.get(id).ball.direction.angle * (Math.PI / 180));
		this.games.get(id).ball.direction.y = this.games.get(id).ball.direction.speed * Math.sin(this.games.get(id).ball.direction.angle * (Math.PI / 180));
	}

	#collisionControl(id: number) {
		if (this.games.get(id).ball.direction.x > 0) {
			if (this.#isBallAtPaddle(id, this.games.get(id).paddleRight) &&
				this.#isBallWithinPaddleRange(id, this.games.get(id).paddleRight)) {
					this.#updateBallDirection(id, this.games.get(id).paddleRight);
			}
		}
		else {
			if (this.#isBallAtPaddle(id, this.games.get(id).paddleLeft) &&
				this.#isBallWithinPaddleRange(id, this.games.get(id).paddleLeft)) {
					this.#updateBallDirection(id, this.games.get(id).paddleLeft);
			}
		}
	}

	#scored(id: number): boolean {
		var ret: boolean = false;
		if (this.games.get(id).ball.position.x - this.games.get(id).ball.radius <= 0) {
			this.games.get(id).score.scoreRight += this.games.get(id).score.increaseRight;
			this.games.get(id).scoreRight += this.games.get(id).score.increaseRight;
			ret = true;
		}
		else if (this.games.get(id).ball.position.x + this.games.get(id).ball.radius >= 640 ) {
			this.games.get(id).score.scoreLeft += this.games.get(id).score.increaseLeft;
			this.games.get(id).scoreLeft += this.games.get(id).score.increaseLeft;
			ret = true;
		}
		return ret;
	}

	#reset(id: number) {
		this.games.get(id).ball.position.x = this.setup.ballPos.x;
		this.games.get(id).ball.position.y = this.setup.ballPos.y;
		this.games.get(id).ball.direction.speed = this.setup.ballDir.speed;
		this.games.get(id).ball.direction.angle = Math.random() * 2 * Math.PI;
		this.games.get(id).ball.direction.x = this.games.get(id).ball.direction.speed * Math.cos(this.games.get(id).ball.direction.angle);
		this.games.get(id).ball.direction.y = this.games.get(id).ball.direction.speed * Math.sin(this.games.get(id).ball.direction.angle); // * 0.1
		this.games.get(id).ball.radius = this.setup.ballRadius;

		this.games.get(id).paddleLeft.width = this.setup.paddleWidth;
		this.games.get(id).paddleLeft.height = this.setup.paddleHeight;
		this.games.get(id).paddleLeft.speed = this.setup.paddleSpeed;
		this.games.get(id).paddleRight.width = this.setup.paddleWidth;
		this.games.get(id).paddleRight.height = this.setup.paddleHeight;
		this.games.get(id).paddleRight.speed = this.setup.paddleSpeed;

		this.games.get(id).score.increaseLeft = this.setup.scoreIncrease;
		this.games.get(id).score.increaseRight = this.setup.scoreIncrease;
	}

	#isGameFinished(id: number) {
		var game: Game = this.games.get(id);
		if (game.finished) {
			clearInterval(this.intervals.get(id));
			this.intervals.delete(id);
			this.users.delete(game.playerLeft);
			this.users.delete(game.playerRight);
			this.games.delete(id);
			this.sockets.get(id)[0].leave(id.toString());
			this.sockets.get(id)[1].leave(id.toString());
			this.sockets.delete(id);
			console.log("game finished, keys removed");
			// TODO: delete room (?)
			// TODO: reset frontend variables
		}
		if (game.score.scoreLeft == 10 || game.score.scoreRight == 10) {
			game.finished = true;
		}
	}

	movePaddleUp(id: number, b: boolean) {
		if (b) {
			if (this.games.get(id).paddleLeft.position.y > 0)
				this.games.get(id).paddleLeft.position.y -= this.games.get(id).paddleLeft.speed;
		}
		else {
			if (this.games.get(id).paddleRight.position.y > 0)
				this.games.get(id).paddleRight.position.y -= this.games.get(id).paddleRight.speed;
		}
	}

	movePaddleDown(id: number, b: boolean) {
		if (b) {
			if (this.games.get(id).paddleLeft.position.y < (480 - this.games.get(id).paddleLeft.height))
				this.games.get(id).paddleLeft.position.y += this.games.get(id).paddleLeft.speed;
		}
		else {
			if (this.games.get(id).paddleRight.position.y < (480 - this.games.get(id).paddleRight.height))
				this.games.get(id).paddleRight.position.y += this.games.get(id).paddleRight.speed;
		}
	}
}
