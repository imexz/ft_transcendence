import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { map, interval, Observable } from 'rxjs';
import { Game } from './game.entities/game.entity';
import { Paddle } from './game.entities/paddle.entity';
import { Score } from './game.entities/score.entity';
import { GameSetup } from './game.entities/setup.entity';
import { JwtAuthGuard } from 'src/auth/jwt-two/jwt-auth.guard';

// interface MessageEvent {
// 	data: Game | undefined;
// }

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get('spectate/:id')
	@UseGuards(JwtAuthGuard)
	spectate(@Param('id') playerId: number) {
		const gameId = this.gameService.users.get(playerId.toString());
		// TODO: get userId of spectator
		// map spectator to gameId in gameService.users map
		// redirect to PongGame.vue (?)
		return gameId;
	}

}
