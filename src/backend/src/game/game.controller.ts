import { Controller, Get, UseGuards, Param, Request, UseInterceptors, ClassSerializerInterceptor} from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/jwt-two/jwt-auth.guard';
import { GameGateway } from './game.gateway';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService,
		private readonly gameGateway: GameGateway) {}

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
	
	@Get('live/:id')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	getGame(@Param('id') id: number, @Request() req?) {
		console.log("getGame api", id);
		const ret = this.gameService.getGame(id)
		console.log("ret = ", ret);
		
		return ret
	}

	@Get('view/:id')
	@UseGuards(JwtAuthGuard)
	// @UseInterceptors(ClassSerializerInterceptor)
	viewGame(@Param('id') id: number, @Request() req) {
		console.log("viewGame api");
		const game = this.getGame(id)
		if (game) {
			console.log("usser = ", req.user);
			
			this.gameGateway.viewRequest(req.user.id , game.id)
		}


	}

}
