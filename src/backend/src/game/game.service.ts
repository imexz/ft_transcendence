import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Game, Side } from './game.entities/game.entity';
import { Paddle } from './game.entities/paddle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from 'socket.io';
import { GameSetup } from './game.entities/setup.entity';
import { UsersService } from 'src/users/users.service';
import User from 'src/users/entitys/user.entity';
import { UserStatus } from "../users/entitys/status.enum";
import { GameGateway } from './game.gateway';
import { Settings } from './game.entities/settings';
import { BallDirObj } from './game.interfaces/balldirobj.interface';

@Injectable()
export class GameService {
	
	
	constructor(
		private userService: UsersService,
		@Inject(forwardRef(() => GameGateway))
		private gameGateway: GameGateway,
		){}

	setup = new GameSetup;
	gamesArr: Array<Game> = []
	spectatorsMap = new Map<number, Game>;

	@InjectRepository(Game)
	private gameRepository: Repository<Game>

	getGame(user_id: number | undefined, isCustomized: boolean = false): Game {
		return this.gamesArr.find((value: Game) =>  {
			const isPlayer: boolean = value.winner?.id == user_id || value.loser?.id == user_id
			if (user_id)
				return isPlayer
			else {
				return isPlayer && value.isCustomized === isCustomized
			}
		})
	}

	addUserToSpectators(userId: number, game: Game) {
		this.spectatorsMap.set(userId, game);
		game.spectators.push(userId);
	}

	removeUserFromSpectators(userId: number, game: Game) {
		if (game != undefined) {
			this.spectatorsMap.delete(userId);
			const index = game.spectators.indexOf(userId);
			if (index > -1) {
				game.spectators.splice(index, 1);
			}
		}
	}

	getSpectatedGame(userId: number): Game | undefined {
		return this.spectatorsMap.get(userId)
	}

	clearSpectatorArr(game: Game) {
		game.spectators.length = 0;
	}

	async joinGameOrCreateGame(user: User, settings: Settings, opponentUserId?: number): Promise<Game> {
		let game = this.getGame(undefined) // checking for first game with missing (undefined) opponent
		if (game == undefined || opponentUserId) {
			game = await this.createGameInstance(user.id, settings)
			// console.log("joinGameOrCreateGame", game.settings);
			game.winner = user
			// opponentUserId is set when called via Frontend::askForMatch
			if(opponentUserId != undefined) {
				const opponent = await this.userService.getUser(opponentUserId)
				game.loser = opponent
			}
			this.gamesArr.push(game)
		} else { // queue game exists, join and set user as opponent
			console.log("joinGameOrCreateGame: set User as loser");
			game.loser = user
		}
		return game
	}
	async createGameInstance(userId: number, settings: Settings): Promise<Game> {
		console.log('inside createGameInstance()');
		// let settings = new Settings();
		// console.log("before", settings);
		// const socket = await this.gameGateway.findSocketOfUser(userId);
		// let receivedSettings: boolean = false;
		// if (socket) {
		// 	socket.emit('requestSettings', (cb) => {
		// 		// console.log("callback", cb.data);
		// 		settings = cb.data;
		// 		receivedSettings = true;
		// 	});
		// } else {
		// 	console.log("no socket for", userId);
		// }
		// const setup = new GameSetup();
		// while (!receivedSettings) {
		// 	await new Promise(r => setTimeout(r, 10));
		// }
		// console.log('leaving createGameInstance()', settings);
		return new Game(userId, settings);
	}

	async startGame(server: Server, game: Game) {
		if (game.winner != undefined && game.loser != undefined) {
			const winner = await this.gameGateway.findSocketOfUser(game.winner.id)
			const sloserocket = await this.gameGateway.findSocketOfUser(game.loser.id)
			if (winner && sloserocket)
				this.startEmittingGameData(server, game)
		}
	  }

	async startEmittingGameData(server: Server, game: Game) {
		this.userService.setStatus(game.winner.id, UserStatus.PLAYING);
		this.userService.setStatus(game.loser.id, UserStatus.PLAYING);
		server.to(game.id.toString()).emit('GameInfo', game)
		console.log("startGame");
		game.interval = setInterval(() => this.emitGameData(game, server), 16) as unknown as number;
		this.gameGateway.server.to(game.id.toString()).emit('updatePaddle', {paddleRight: game.paddleRight, paddleLeft: game.paddleLeft})
		console.log("startGame end");
	}

	async emitGameData(game: Game, server: Server) {
		const tmpGame: Game = await this.getData(game)
		
		const updatedBall = {
			position: tmpGame.ball.position,
			radius: tmpGame.ball.radius,
		}
		
		server.to(game.id.toString()).emit('updateBall', updatedBall);
		if (tmpGame.score.scoreLeft === tmpGame.settings.scoreToWin || tmpGame.score.scoreRight === tmpGame.settings.scoreToWin) {
			console.log("emitGameData: closeRoom");
			this.gameGateway.closeRoom(game.id.toString());
		}
	}

	async getData(game: Game): Promise<Game | undefined> {
		if (game == undefined) {
			return undefined;
		}
		this.updateBall(game)
		this.collisionControl(game);
		if (this.scored(game)){
			this.reset(game);
			this.gameGateway.server.to(game.id.toString()).emit('updateScore', {scoreWinner: game.score.scoreLeft, scoreLoser: game.score.scoreRight, scoreToWin: game.settings.scoreToWin})
		}
		await this.isGameFinished(game);
		return game
	}
	updateBall(game: Game) {
		// game.ball.position.x += game.ball.direction.x;
		// game.ball.position.y += game.ball.direction.y;
		// if (game.ball.direction.y > 0) {
		// 	if (game.ball.position.y + game.ball.radius >= 480) {
		// 		game.ball.position.y = 480 - game.ball.radius;
		// 		game.ball.direction.y *= -1;
		// 	}
		// }
		// else {
		// 	if (game.ball.position.y - game.ball.radius <= 0) {
		// 		game.ball.position.y = 0 + game.ball.radius;
		// 		game.ball.direction.y *= -1;
		// 	}
		// }
		game.ball.BallPostionNext()
	}
	isBallWithinPaddleRange(game: Game, paddle: Paddle): boolean {
		return (game.ball.position.y >= paddle.position.y &&
			game.ball.position.y <= paddle.position.y + paddle.height)
	}
	isBallAtPaddle(game: Game, paddle: Paddle): boolean {
		let ret: boolean = false;
		if (paddle.side == Side.left) {
			ret = game.ball.position.x - game.ball.radius <= paddle.position.x + paddle.width;
		} else if (paddle.side == Side.right) {
			ret = game.ball.position.x + game.ball.radius >= paddle.position.x;
		}
		return ret;
	}
	calcAngle(game: Game, paddle: Paddle) {
		var section: number;

		section = paddle.height / 8;
		if (this.isBallWithinPaddleRange(game, paddle)) {
			var i: number = 1;
			while (game.ball.position.y > (paddle.position.y + i * section)) {
				i++;
			}
			game.ball.direction.angle = paddle.reboundAngles[i - 1];
		}
	}
	updateBallDirection(game: Game, paddle: Paddle) {
		this.calcAngle(game, paddle);
		game.ball.direction.x = game.ball.direction.speed * Math.cos(game.ball.direction.angle * (Math.PI / 180));
		game.ball.direction.y = game.ball.direction.speed * Math.sin(game.ball.direction.angle * (Math.PI / 180));
	}
	collisionControl(game: Game) {
		if (game.ball.direction.x > 0) {
			if (this.isBallAtPaddle(game, game.paddleRight) &&
				this.isBallWithinPaddleRange(game, game.paddleRight)) {
					console.log("updateBallDirection right");
					
					this.updateBallDirection(game, game.paddleRight);
				}
			}
			else {
				if (this.isBallAtPaddle(game, game.paddleLeft) &&
				this.isBallWithinPaddleRange(game, game.paddleLeft)) {
					console.log("updateBallDirection left");
					this.updateBallDirection(game, game.paddleLeft);
			}
		}
	}
	scored(game: Game): boolean {
		var ret: boolean = false;
		if (game.ball.position.x - game.ball.radius <= 0) {
			game.score.scoreRight += game.score.increaseRight;
			game.scoreLoser += game.score.increaseRight;
			ret = true;
		}
		else if (game.ball.position.x + game.ball.radius >= 640 ) {
			game.score.scoreLeft += game.score.increaseLeft;
			game.scoreWinner += game.score.increaseLeft;
			ret = true;
		}
		return ret;
	}



	reset(game: Game) {
		game.ball.position = GameSetup.staticballPos
		// console.log("GameSetup.staticballPos", GameSetup.staticballPos);
		game.ball.reset()
		game.ball.direction.newBallDir()

		game.ball.radius = GameSetup.ballRadius;

		game.paddleLeft.reset()
		game.paddleRight.reset()

		game.score.increaseLeft = GameSetup.scoreIncrease;
		game.score.increaseRight = GameSetup.scoreIncrease;
	}
	async isGameFinished(game: Game) {
		if (game != undefined && (game.score.scoreLeft == game.settings.scoreToWin || game.score.scoreRight == game.settings.scoreToWin)) {
			clearInterval(game.interval);
			game.interval = null
			let gameInstance: Game = this.gameRepository.create();
			if (game.scoreWinner < game.scoreLoser) {
				const tmp: User = game.winner;
				game.winner = game.loser;
				game.loser = tmp;
			}
			gameInstance.loser = game.loser;
			gameInstance.winner = game.winner;
			gameInstance.scoreWinner = game.scoreWinner;
			gameInstance.scoreLoser = game.scoreLoser;
			await this.gameRepository.save(gameInstance);
			this.userService.setStatus(game.winner.id, UserStatus.ONLINE)
			this.userService.setStatus(game.loser.id, UserStatus.ONLINE)
			this.removeGame(game)
			this.gameGateway.server.to(game.id.toString()).emit('isFinished')
			console.log("game is finished");
		}
	}

	removeGame(game: Game): boolean {
		game.spectators.forEach(async (element: number) =>  { this.spectatorsMap.delete(element) })
		const index = this.gamesArr.indexOf(game, 0);
		if (index > -1) {
			this.gamesArr.splice(index, 1);
			return true;
		}
		return false;
	}

	handleKeypress(user_id: number, key: string){
		const game = this.getGame(user_id)
		if(game != undefined) {
			if (key == "ArrowUp" || key == "w") {
				this.movePaddleUp(game, this.getPlayerSide(game, user_id))
				console.log("paddle Up");
			} else if (key == "ArrowDown" || key == "s") {
				this.movePaddleDown(game, this.getPlayerSide(game, user_id))
				console.log("paddle Down");
			}
		}
	}

	getPlayerSide(game: Game, user_id: number) {
		if (game != undefined) {
			if (game.winner.id == user_id) {
				return Side.left
			} else {
				return Side.right
			}
		}
	}

	movePaddleUp(game: Game, side: Side) {
		if (side == Side.left) {
			if (game.paddleLeft.position.y > 0)
				game.paddleLeft.position.y -= game.paddleLeft.speed;
		}
		else {
			if (game.paddleRight.position.y > 0)
				game.paddleRight.position.y -= game.paddleRight.speed;
		}
		this.gameGateway.server.to(game.id.toString()).emit('updatePaddle', {paddleRight: game.paddleRight, paddleLeft: game.paddleLeft})
	}
	movePaddleDown(game: Game, side: Side) {
		if (side == Side.left) {
			if (game.paddleLeft.position.y < (480 - game.paddleLeft.height))
				game.paddleLeft.position.y += game.paddleLeft.speed;
		}
		else {
			if (game.paddleRight.position.y < (480 - game.paddleRight.height))
				game.paddleRight.position.y += game.paddleRight.speed;
		}
		this.gameGateway.server.to(game.id.toString()).emit('updatePaddle', {paddleRight: game.paddleRight, paddleLeft: game.paddleLeft})
	}

	async getMatchHistory(userId: number){
		if (userId == undefined) {
			console.log("userId == undefind");
		}
		console.log("userId", userId, typeof(userId));
		return await this.gameRepository.createQueryBuilder("game")
		// .innerJoinAndSelect("game.player", "player", "player.id = :id", { id: user.id})
		.leftJoin('game.loser', 'tmp', 'tmp.id = :id', { id: userId as number} )
		.leftJoin('game.winner', 'tmp1', 'tmp1.id = :idd', { idd: userId  as number})
		.leftJoinAndSelect('game.loser', 'loser', 'loser.id != :iid', { iid: userId} )
		.leftJoinAndSelect('game.winner', 'winner', 'winner.id != :iidd', { iidd: userId})
		.where("game.loser.id = :te", {te: userId})
		.orWhere("game.winner.id = :te1", {te1: userId})
		// .innerJoinAndSelect("game.loser", "loser", "loser.id != :id", { id: user.id} )
		// .innerJoinAndSelect("game.player", "player", "player.id != :id", { id: user.id})
		// .select("'scoreWinner'")
		.getMany()
	}

}
