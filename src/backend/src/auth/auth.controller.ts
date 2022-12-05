import { Controller, Get, Redirect, Request, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './42/local-auth.guard';
import { AuthService } from './auth.service';
//import { JwtAuthGuard } from './jwt-auth.guard';
import { hostURL } from '../hostURL';
import { JwtAuthGuard } from './jwt-two/jwt-auth.guard';

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
		// console.log('login/callback');

		// res.cookie("token", this.authService.login(req.user));


		// res.setHeader('Set-Cookie', [this.authService.getCookieWithJwtAccessToken(
		// 	req.user.id,
		// 	req.user.isTwoFactorAuthenticationEnabled,
		// )]);
		// res.cookie("token", [this.authService.getCookieWithJwtAccessToken(
		// 	req.user.id,
		// 	req.user.isTwoFactorAuthenticationEnabled,
		// )]);
		res.setHeader('Set-Cookie', this.authService.getCookieWithJwtAccessToken(
			req.user.id,
			false,
		))

    // console.log(req.user.isTwoFactorAuthenticationEnabled)
    if (req.user.isTwoFactorAuthenticationEnabled){
      return {
        url: hostURL + ":8080/login/tfa"
      }
    }

		return {
			url: hostURL + ":8080/login"
		}
	}

	@Get('logout')
	@UseGuards(JwtAuthGuard)
	logout(@Request() req, @Res({ passthrough: true }) res) {
		// console.log("logout");

		// res.setHeader('Set-Cookie', this.authService.getCookieWithJwtAccessToken(
		// 	req.user.id,
		// 	false,
		// ) + '; Max-Age=0')
	}

	// @Get('protected')
	// @UseGuards(JwtAuthGuard)
	// getusers(@Request() req): string {
	// 	return "test"
	// }

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
