import {Redirect, Controller, Request, Get, Param, UseGuards, Delete, Res } from '@nestjs/common';
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
	@Redirect("", 302)
	callback(@Request() req, @Res({ passthrough: true }) res ) {
		res.cookie("token", this.authService.login(req.user));
		// res.Redirect = process.env.HOME + ":8080/login"
		// {domain: "http://localhost:3000/", maxAge: 6000 , sameSite: 'lax'}
		return {
			url: process.env.HOST + ":8080/login"
		}
	}

	@Get('protected')
	@UseGuards(JwtAuthGuard)
	getusers(@Request() req): string {
		return "test"
	}


	// @Get('getall')
	// @UseGuards(JwtAuthGuard)
	// getall(@Request() req) {
	// 	return this.authService.findAll();
	// }

	// @Delete(':id')
	// deleteUser(@Param('id') id: number) {
	// 	return this.authService.deleteUser(id);
	// }


	// @Get(':id')
	// @UseGuards(JwtAuthGuard)
	// addfriend(@Param('id') id: number, @Request() req) {
	// 	console.log(id);
	// 	// console.log(req);
		
	// 	return	this.authService.addfriend(req.user.id, id);
	// }
}
