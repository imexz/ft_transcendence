import { Controller, Sse, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { map, interval, Observable } from 'rxjs';
import { Game } from './game.entities/game.entity';
// import { Ball } from './game.entities/ball.entity';
import { Paddle } from './game.entities/paddle.entity';
import { Score } from './game.entities/score.entity';
import { GameSetup } from './game.entities/setup.entity';

// interface MessageEvent {
// 	data: Game | undefined;
// }

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	// change to websockets: each game gets its own room, sockets of players join this room. send data to backend with set interval
	// @Sse('sse/:gameid')
	// sse(@Param('gameid') gameid: number): Observable<MessageEvent> {
	// 	return interval(100).pipe(map((_) => ({data: this.gameService.getData(gameid)})));
	// }
}
