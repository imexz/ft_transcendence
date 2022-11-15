import { Controller, Get, UseGuards, Param, Request, UseInterceptors, ClassSerializerInterceptor} from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/jwt-two/jwt-auth.guard';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	getMyMatchHistory(@Request() req)
	{
		return this.gameService.getMatchHistory(req.user.id)
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	getMatchHistory(@Param('id') id: number, @Request() req)
	{
		return this.gameService.getMatchHistory(id)
	}
}
