import { Controller, Sse, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { map, interval, Observable } from 'rxjs';
import { Game } from './game.entities/game.entity';

interface MessageEvent {
	data: Game;
}

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Sse('sse/:gameid')
	sse(@Param('gameid') gameid: number): Observable<MessageEvent> {
		console.log("sse");

		// console.log(this.gameService.getData(gameid));
		// console.log("after print");
		var game = {
			ball: {
				position: {
					x: 20,
					y: 20,
				},
				direction: {
					x: 1,
					y: 1,
					speed: 1,
					angle: 10,
				},
				radius: 20,
			},
			paddleLeft: {
				position: {
					x: 10,
					y: 210,
				},
				width: 20,
				height: 100,
				speed: 10,
				reboundAngles: [-45, -30, -15, 0, 0, 15, 30, 45],
				id: "left",
				socketid: "hey",
			},
			paddleRight: {
				position: {
					x: 610,
					y: 210,
				},
				id: "right",
				speed: 10,
				width: 20,
				height: 100,
				socketid: "hi",
				reboundAngles: [-135, -150, -165, 180, 180, 165, 150, 135],
			},
			score: {
				scoreLeft: 0,
				scoreRight: 0,
				increaseLeft: 1,
				increaseRight: 1,
			},
			scoreLeft: 0,
			scoreRight: 0,
			id: gameid,
			player: [],
			playerLeft: "p1",
			playerRight: "p2",
		}
		return interval(100).pipe(map((_) => ({data: game})));
		// return interval(100).pipe(map((_) => ({data: this.gameService.getData(gameid)})));
	}
}
