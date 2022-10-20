import { Controller, Get, UseGuards, Param, Request } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/jwt-two/jwt-auth.guard';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get('spectate/:id')
	@UseGuards(JwtAuthGuard)
	spectate(@Request() req, @Param('id') playerId: number) {
		const gameId: number = this.gameService.users.get(playerId.toString());
		this.gameService.users.set(req.user._id.toString(), gameId);
		return gameId;
	}
}
