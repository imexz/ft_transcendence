import { Controller, Get, UseGuards, Param, Request, UseInterceptors, ClassSerializerInterceptor} from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/jwt-two/jwt-auth.guard';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	getMatchHistory(@Request() req)
	{
		return this.gameService.getMatchHistory(req.user)
	}



}
