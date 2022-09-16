import { Controller, Get, Sse } from '@nestjs/common';
import { GameService } from './game.service';
import { map, interval, Observable } from 'rxjs';
import { GameObj } from './game.interfaces/gameobj.interface';

interface MessageEvent {
	data: GameObj;
}

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Sse('sse')
	sse(): Observable<MessageEvent> {
		return interval(5).pipe(map((_) => ({data : this.gameService.getData()})));
	}
}
