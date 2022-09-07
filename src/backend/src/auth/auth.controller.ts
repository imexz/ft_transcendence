import { Controller, Request, Get, Param, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard'
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController{
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Get('login')
	async login(@Request() req) {
		return req.user;
	}

	@UseGuards(LocalAuthGuard)
	@Get('login/callback')
	callback(@Request() req) {
		
	  return this.authService.login(req.user);
	}

	@Get('protected')
	@UseGuards(JwtAuthGuard)
	getusers(@Request() req): string {
		console.log(req.user);
		
		return req.user
	}

	@Get('getall')
	// @UseGuards(JwtAuthGuard)
	getall(@Request() req) {
		return this.authService.findAll();
	}
	@Get(':id')
	@UseGuards(JwtAuthGuard)
	addfriend(@Param('id') id: number, @Request() req) {
		console.log(id);
		// console.log(req);
		
		return	this.authService.addfriend(req.user.id, id);
	}
}
