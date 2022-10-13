import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards, Request, UseInterceptors, ClassSerializerInterceptor, HttpCode, Req, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { User } from './entitys/user.entity';
import { JwtAuthGuard } from '../auth/jwt-two/jwt-auth.guard';
import { response } from 'express';
import TwoFactorAuthenticationCodeDto from 'src/auth/dto/turnOnTwoFactorAuthentication.dto';
import { TwofaService } from 'src/twofa/twofa.service';


@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService,
		private readonly twofaService: TwofaService ){}

	@Get('find/:id')
	@UseGuards(JwtAuthGuard)
	findOne(@Param('id') params: number){
		return this.usersService.getUser(params)
	}

	@Get('allUser')
	@UseGuards(JwtAuthGuard)
	findAll(){
		return this.usersService.findAll()
	}

	@Post('addUser')
	@UseGuards(JwtAuthGuard)
	addUser(@Body() user: User){
		// console.log(user);
		return  this.usersService.addUser(user);
	}

	@Post('addFriend')
	@UseGuards(JwtAuthGuard)
	addFriend(@Request() req, @Body("id") id: number){
		// console.log(id);
		// return  this.usersService.addfriend(req.user._id, id);
	}

	@Post('removeFriend')
	@UseGuards(JwtAuthGuard)
	removeFriend(@Request() req, @Body("id") id: number){
		// console.log(id);
		// return  this.usersService.addfriend(req.user._id, id);
	}

	@Get('friends')
	@UseGuards(JwtAuthGuard)
	getFriends(@Request() req) {
		// return this.usersService.getFriends(req.user._id)
	}

	@Get('validate')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	validate(@Request() req): Promise<User> {
		// console.log("inside validate");
		// console.log(req.user);

		const user = this.usersService.getUser(req.user._id)
		// console.log(user);
		return user
	}

	@Post('update_name')
	@UseGuards(JwtAuthGuard)
	update_name(@Body("name") name, @Request() req) {
		this.usersService.updateName(req.user._id, name);
	}

	@Delete()
	delete(@Request() req) {
		this.usersService.remove(req.user._id)
	}

	@Post('turn-on')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async turnOnTwoFactorAuthentication(
	  @Req() request,
	  @Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto
	) {
	  const isCodeValid = this.twofaService.isTwoFactorAuthenticationCodeValid(
		twoFactorAuthenticationCode,
		request.user
	  );
	  if (!isCodeValid) {
		throw new UnauthorizedException('Wrong authentication code');
	  }
	  await this.usersService.turnOnTwoFactorAuthentication(request.user._id);
	}

	@Get('turn-off')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async turnOffTwoFactorAuthentication(
	  @Req() request,
	) {
	  await this.usersService.turnOffTwoFactorAuthentication(request.user._id);
	}

}
