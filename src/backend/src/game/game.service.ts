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
			const isPlayer: boolean = value.playerLeft?.id == user_id || value.playerRight?.id == user_id
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

	async joinGameOrCreateGame(user: User, isCustomized: boolean, opponentUserId?: number): Promise<Game> {
		let game = this.getGame(undefined, isCustomized) // checking for first game with missing (undefined) opponent
		if (game == undefined || opponentUserId) {
			game = await this.createGameInstance(user.id, isCustomized)
			game.playerLeft = user
			// opponentUserId is set when called via Frontend::askForMatch
			if(opponentUserId != undefined) {
				const opponent = await this.userService.getUser(opponentUserId)
				game.playerRight = opponent
			}
			this.gamesArr.push(game)
		} else { // queue game exists, join and set user as opponent
			console.log("joinGameOrCreateGame: set User as playerRight");
			game.playerRight = user
		}
		return game
	}
	async createGameInstance(userId: number, isCustomized: boolean): Promise<Game> {
		console.log('inside createGameInstance()');
		const setup = new GameSetup;
		console.log('leaving createGameInstance()');
		return new Game(userId, setup, isCustomized);
	}

	async startGame(server: Server, game: Game) {
		if (game.playerLeft != undefined && game.playerRight != undefined) {
			const socketPlayerLeft = await this.gameGateway.findSocketOfUser(game.playerLeft.id)
			const socketPlayerRight = await this.gameGateway.findSocketOfUser(game.playerRight.id)
			if (socketPlayerLeft && socketPlayerRight)
				this.startEmittingGameData(server, game)
		}
	  }

	async startEmittingGameData(server: Server, game: Game) {
		this.userService.setStatus(game.playerLeft.id, UserStatus.PLAYING);
		this.userService.setStatus(game.playerRight.id, UserStatus.PLAYING);
		server.to(game.id.toString()).emit('GameInfo', game)
		console.log("startGame");
		game.interval = setInterval(() => this.emitGameData(game, server), 1) as unknown as number;
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
		if (tmpGame.score.scoreLeft === 3 || tmpGame.score.scoreRight === 3) {
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
			this.gameGateway.server.to(game.id.toString()).emit('updateScore', {scoreLeft: game.score.scoreLeft, scoreRight: game.score.scoreRight})
		}
		await this.isGameFinished(game);
		return game
	}
	updateBall(game: Game) {
		game.ball.position.x += game.ball.direction.x;
		game.ball.position.y += game.ball.direction.y;
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
	}
	isBallWithinPaddleRange(game: Game, paddle: Paddle): boolean {
		return (game.ball.position.y >= paddle.position.y &&
			game.ball.position.y <= paddle.position.y + paddle.height)
	}
	isBallAtPaddle(game: Game, paddle: Paddle): boolean {
		let ret: boolean = false;
		if (paddle.id == "left") {
			ret = game.ball.position.x - game.ball.radius <= paddle.position.x + paddle.width;
		} else if (paddle.id == "right") {
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
					this.updateBallDirection(game, game.paddleRight);
			}
		}
		else {
			if (this.isBallAtPaddle(game, game.paddleLeft) &&
				this.isBallWithinPaddleRange(game, game.paddleLeft)) {
					this.updateBallDirection(game, game.paddleLeft);
			}
		}
	}
	scored(game: Game): boolean {
		var ret: boolean = false;
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

	isDirectionValid(angle: number): boolean {
		return (angle <= Math.PI / 4 || angle >= 7 * Math.PI / 4 || (angle >= 3 * Math.PI / 4 && angle <= 5 * Math.PI / 4));
	}
	reset(game: Game) {
		game.ball.position.x = this.setup.ballPos.x;
		game.ball.position.y = this.setup.ballPos.y;
		game.ball.direction.speed = this.setup.ballDir.speed;
		do {
			game.ball.direction.angle = Math.random() * 2 * Math.PI;
		}
		while (!this.isDirectionValid(game.ball.direction.angle));
		game.ball.direction.x = game.ball.direction.speed * Math.cos(game.ball.direction.angle);
		game.ball.direction.y = game.ball.direction.speed * Math.sin(game.ball.direction.angle);
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
	async isGameFinished(game: Game) {
		if (game != undefined && (game.score.scoreLeft == 3 || game.score.scoreRight == 3)) {
			clearInterval(game.interval);
			game.interval = null
			let gameInstance: Game = this.gameRepository.create();
			gameInstance.playerRight = game.playerRight;
			gameInstance.playerLeft = game.playerLeft;
			gameInstance.scoreLeft = game.scoreLeft;
			gameInstance.scoreRight = game.scoreRight;
			await this.gameRepository.save(gameInstance);
			this.userService.setStatus(game.playerLeft.id, UserStatus.ONLINE)
			this.userService.setStatus(game.playerRight.id, UserStatus.ONLINE)
			this.removeGame(game)
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
			if (game.playerLeft.id == user_id) {
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

	async getMatchHistory(user: User){
		if (user == undefined) {
			console.log("user == undefind");
		}
		console.log("user.id", user.id, typeof(user.id));
		return await this.gameRepository.createQueryBuilder("game")
		// .innerJoinAndSelect("game.player", "player", "player.id = :id", { id: user.id})
		.leftJoin('game.playerRight', 'tmp', 'tmp.id = :id', { id: user.id as number} )
		.leftJoin('game.playerLeft', 'tmp1', 'tmp1.id = :idd', { idd: user.id  as number})
		.leftJoinAndSelect('game.playerRight', 'playerRight', 'playerRight.id != :iid', { iid: user.id} )
		.leftJoinAndSelect('game.playerLeft', 'playerLeft', 'playerLeft.id != :iidd', { iidd: user.id})
		.where("game.playerRight.id = :te", {te: user.id})
		.orWhere("game.playerLeft.id = :te1", {te1: user.id})
		// .innerJoinAndSelect("game.playerRight", "playerRight", "playerRight.id != :id", { id: user.id} )
		// .innerJoinAndSelect("game.player", "player", "player.id != :id", { id: user.id})
		// .select("'scoreLeft'")
		.getMany()
	}
}
