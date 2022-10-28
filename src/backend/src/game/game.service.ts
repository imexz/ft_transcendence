import { Injectable } from '@nestjs/common';
import { Game, Side } from './game.entities/game.entity';
import { Paddle } from './game.entities/paddle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket, Server } from 'socket.io';
import { GameSetup } from './game.entities/setup.entity';
import { QueueElem } from './game.interfaces/queueobj.interface'
import { UsersService } from 'src/users/users.service';
import User from 'src/users/entitys/user.entity';
import { GameData } from './game.entities/gameData';

@Injectable()
export class GameService {
  startGame(server: Server, game: Game) {
    if (game.playerLeft != undefined && game.playerRight != undefined) {
		this.#startGame(server, game)	
	}
  }
  // }

	constructor(
		private userService: UsersService,
	){}

	setup = new GameSetup;

	@InjectRepository(Game)
	private gameRepository: Repository<Game>

	// queue: Array<QueueElem> = [];
	// SamuelQueue: Array<number> = [];
	Samuel: Array<Game> = []
	// users:  Map<string, number> = new Map<string, number>(); // Key: UserId, Value: GameId
	// games = new Map<number, Game>(); // Key: GameId, Value: Game
	intervals = new Map<number, number>(); // Key: GameId, Value: IntervalId
	// sockets = new Map<number, Socket[]>(); // Key: GameId, Value: Array of Sockets


	getGame(user_id: number | undefined): Game {
		// console.log("getGame b");
		// console.log(this.Samuel);

		return this.Samuel.find((value: Game) =>  value.playerLeft?._id == user_id || value.playerRight?._id == user_id)
	}
	
	getPlayerSide(game: Game, user_id: number) {
		// console.log(game.playerLeft._id, user_id);
		
		if (game != undefined) {
			if (game.playerLeft._id == user_id) {
				return Side.left
			} else {
				return Side.right
			}
		}
	}

	handelKeypress(user_id: number, key: string){
		const game = this.getGame(user_id)
		if(game != undefined) {
			if (key == "ArrowUp" || key == "w") {
				this.movePaddleUp(game, this.getPlayerSide(game, user_id))			
			} else if (key == "ArrowDown" || key == "s") {
				this.movePaddleDown(game, this.getPlayerSide(game, user_id))			
			}
		}
	}

	async JoinGameOrCreatGame(user: User, server: Server, user_id?: number): Promise<Game> {
		let game = this.getGame(undefined)
		// console.log("getGame", game);
		
		if (game == undefined) {
			game = await this.#createGameInstance()
			game.playerLeft = user
			this.Samuel.push(game)
			console.log("game created", game);
			if(user_id != undefined) {
				const player = await this.userService.getUser(user_id)
				game.playerRight = player
			}
		} else {
			game.playerRight = user
		}
		return game
	}
	
	async #createGameInstance(): Promise<Game> {
		console.log('inside createGameInstance()');
		const setup = new GameSetup;
		var game = this.gameRepository.create();
		console.log("after repo create");
		game = await this.gameRepository.save(game);
		// console.log('leaving createGameInstance()');
		return new Game(game.id, setup);
	}


	async #emitGameData(game: Game, server: Server) {
		// console.log("emitGameData");
		const hi: Game = await this.getData(game)
		const test: GameData = {
			ball: hi.ball,
			paddleLeft: hi.paddleLeft,
			paddleRight: hi.paddleRight,
			score: hi.score,
			finished: hi.finished,
		}		
		server.to(game.id.toString()).emit('updateGame', test);
	}

	async #startGame(server: Server, game: Game) {
		server.to(game.id.toString()).emit("Game", game)
		console.log("startGame");
		
		game.interval = setInterval(() => this.#emitGameData(game, server), 16) as unknown as number;
		console.log("startGame end");
	}

	async getData(game: Game): Promise<Game | undefined> {
		// console.log("getData");
		
		if (game == undefined) {
			return undefined;
		}
		this.#updateData(game)
		this.#collisionControl(game);
		if (this.#scored(game)){
			this.#reset(game);
		}
		await this.#isGameFinished(game);
		// console.log("getData ende");
		return game
	}

	#updateData(game: Game) {
		// let game: Game = this.games.get(id);
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

	#isBallWithinPaddleRange(game: Game, paddle: Paddle): boolean {
		return (game.ball.position.y >= paddle.position.y &&
			game.ball.position.y <= paddle.position.y + paddle.height)
	}

	#isBallAtPaddle(game: Game, paddle: Paddle): boolean {
		let ret: boolean = false;
		// let game: Game = this.games.get(id);
		if (paddle.id == "left") {
			ret = game.ball.position.x - game.ball.radius <= paddle.position.x + paddle.width;
		} else if (paddle.id == "right") {
			ret = game.ball.position.x + game.ball.radius >= paddle.position.x;
		}
		return ret;
	}

	#calcAngle(game: Game, paddle: Paddle) {
		var section: number;
		// let game: Game = this.games.get(id);

		section = paddle.height / 8;
		if (this.#isBallWithinPaddleRange(game, paddle)) {
			var i: number = 1;
			while (game.ball.position.y > (paddle.position.y + i * section)) {
				i++;
			}
			game.ball.direction.angle = paddle.reboundAngles[i - 1];
		}
	}

	#updateBallDirection(game: Game, paddle: Paddle) {
		this.#calcAngle(game, paddle);
		// let game: Game = this.games.get(id);
		game.ball.direction.x = game.ball.direction.speed * Math.cos(game.ball.direction.angle * (Math.PI / 180));
		game.ball.direction.y = game.ball.direction.speed * Math.sin(game.ball.direction.angle * (Math.PI / 180));
	}

	#collisionControl(game: Game) {
		// var game: Game = this.games.get(id);
		if (game.ball.direction.x > 0) {
			if (this.#isBallAtPaddle(game, game.paddleRight) &&
				this.#isBallWithinPaddleRange(game, game.paddleRight)) {
					this.#updateBallDirection(game, game.paddleRight);
			}
		}
		else {
			if (this.#isBallAtPaddle(game, game.paddleLeft) &&
				this.#isBallWithinPaddleRange(game, game.paddleLeft)) {
					this.#updateBallDirection(game, game.paddleLeft);
			}
		}
	}

	#scored(game: Game): boolean {
		var ret: boolean = false;
		// let game: Game = this.games.get(id);
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

	#reset(game: Game) {
		// let game: Game = this.games.get(id);
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

	async #isGameFinished(game: Game) {
		// var game: Game | undefined = this.games.get(id);
		if (game != undefined && game.finished) {
			// const gameEntry = this.gameRepository.create({scoreLeft: game.scoreLeft, scoreRight: game.scoreRight});
			// game.playerLeft = await this.userService.getUser(game.playerLeft._id)
			// game.playerRight = await this.userService.getUser(game.playerRight._id)
			await this.gameRepository.save(game);
			clearInterval(game.interval);
			const index = this.Samuel.indexOf(game, 0);
			if (index > -1) {
				this.Samuel.splice(index, 1);
			}
			console.log("in isGameFinished");
			game.finished = false;
			console.log("game finished, keys removed");
			// TODO: delete room (?)
			// TODO: reset frontend variables
		}
		if (game != undefined && (game.score.scoreLeft == 10 || game.score.scoreRight == 10)) {
			game.finished = true;
		}
	}

	movePaddleUp(game: Game, side: Side) {		
		// console.log("movePaddleUp", side);
		
		if (side == Side.left) {
			if (game.paddleLeft.position.y > 0)
				game.paddleLeft.position.y -= game.paddleLeft.speed;
		}
		else {
			if (game.paddleRight.position.y > 0)
				game.paddleRight.position.y -= game.paddleRight.speed;
		}
	}

	movePaddleDown(game: Game, side: Side) {
		// console.log("movePaddleDown", side);

		if (side == Side.left) {
			if (game.paddleLeft.position.y < (480 - game.paddleLeft.height))
				game.paddleLeft.position.y += game.paddleLeft.speed;
		}
		else {
			if (game.paddleRight.position.y < (480 - game.paddleRight.height))
				game.paddleRight.position.y += game.paddleRight.speed;
		}
	}

	leaveGame(user_id: number, game: Game) {

		if (user_id === game.playerLeft._id || user_id === game.playerRight._id) {
			// this.intervals.delete(gameId);
		} else {
			console.log("leaveGame gid", game.id, typeof game.id);
			console.log("leaveGame uid", user_id, typeof user_id);
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
		// .select("'scoreLeft'")
		.getMany()
	}
}
