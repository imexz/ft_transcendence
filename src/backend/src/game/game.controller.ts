import { Controller, Sse, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { map, interval, Observable } from 'rxjs';
import { GameObj } from './game.interfaces/gameobj.interface';
import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

interface MessageEvent {
	data: GameObj;
}

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Sse('sse/:gameid')
	sse(@Param('gameid') gameid: number): Observable<MessageEvent> {
		return interval(5).pipe(map((_) => ({data : this.gameService.getData(gameid)})));
	}
}
