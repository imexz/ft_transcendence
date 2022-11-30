import { HttpException, HttpStatus, Controller, Get, UseGuards, Param, Request, UseInterceptors, ClassSerializerInterceptor} from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/jwt-two/jwt-auth.guard';
import { GameGateway } from './game.gateway';
import { UsersService } from '../users/users.service';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService,
		private readonly gameGateway: GameGateway,
		private readonly usersService: UsersService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	getMyMatchHistory(@Request() req) {
		return this.gameService.getMatchHistory(req.user.id)
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	async getMatchHistory(@Param('id') id: number) {
		if (Number.isNaN(id) || !Number.isFinite(id) || !Number.isSafeInteger(id))
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
		const user = await this.usersService.getUser(id)
		if (user == null || user == undefined)
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
		return this.gameService.getMatchHistory(id)
	}

	@Get('live/:id')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	async getGame(@Param('id') id: number) {
		if (Number.isNaN(id) || !Number.isFinite(id) || !Number.isSafeInteger(id))
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
		const user = await this.usersService.getUser(id)
		if (user == null || user == undefined)
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
		console.log("getGame api", id)
		const ret = this.gameService.getGame(id)
		console.log("ret = ", ret)
		return ret
	}

	@Get('view/:id')
	@UseGuards(JwtAuthGuard)
	// @UseInterceptors(ClassSerializerInterceptor) // @shackbei why is this guard disabled?
	async viewGame(@Param('id') id: number, @Request() req) {
		console.log("viewGame api")
		if (Number.isNaN(id) || !Number.isFinite(id) || !Number.isSafeInteger(id))
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
		const game = await this.getGame(id)
		if (game) {
			console.log("usser = ", req.user)
			this.gameGateway.viewRequest(req?.user?.id , game.id)
		} else {
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
		}
	}
}
