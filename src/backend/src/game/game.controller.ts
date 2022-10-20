import { Controller, Get, UseGuards, Param, Request } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/jwt-two/jwt-auth.guard';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

}
