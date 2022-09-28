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
		return interval(100).pipe(map((_) => ({data: this.gameService.getData(gameid)})));
	}
}
