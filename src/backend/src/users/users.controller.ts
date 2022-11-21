import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import User from './entitys/user.entity';
import { JwtAuthGuard } from '../auth/jwt-two/jwt-auth.guard';
import { TwofaService } from 'src/twofa/twofa.service';
import { FriendsService } from './friends/friends.service';


@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService,
		private readonly twofaService: TwofaService,
		private readonly friendsService: FriendsService ){}

	@Get('find/:id')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	findOne(@Param('id') params: number){
		// console.log("findOne");
		const user = this.usersService.getUser(params);
		// console.log("findOne", user);

		return user;
	}

	@Get('allUser')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	findAll(@Request() req){
		// console.log(req);

		return this.usersService.findAll(req.user.id)
	}

	@Get('allUserWinnes')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	getTopPlayer(@Request() req){
		// console.log(req);

		return this.usersService.getTopPlayer()
	}


	@Post('addUser')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	addUser(@Body() user: User){
		// console.log(user);
		return  this.usersService.addUser(user);
	}

	// @Post('addFriend')
	// @UseGuards(JwtAuthGuard)
	// requestFriend(@Request() req, @Body("id") id: number){
	// 	return this.friendsService.request_friendship(req.user.id, id)
	// 	// console.log(id);
	// 	// return  this.usersService.addfriend(req.user.id, id);
	// }

	// @Post('removeFriend')
	// @UseGuards(JwtAuthGuard)
	// removeFriend(@Request() req, @Body("id") id: number){
	// 	this.friendsService.remove_friendship(req.user.id, id)
	// 	// console.log(id);
	// 	// return  this.usersService.addfriend(req.user.id, id);
	// }

	@Get('validate')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	async validate(@Request() req): Promise<User> {

		// console.log("inside validate");
		// console.log(req.user);
		// console.log("inside validate1");


		// console.log(user);
		return await this.usersService.getUser(req.user.id)
	}

	@Post('update_name')
	@UseGuards(JwtAuthGuard)
	async update_name(@Body("name") name, @Request() req) {
		console.log("inside update_name");
		console.log(req.user);
		console.log("inside update_name1");

		return this.usersService.updateName(req.user, name);
	}

	@Delete()
	delete(@Request() req) {
		this.usersService.remove(req.user.id)
	}



	// @Post('turn-on')
	// @HttpCode(200)
	// @UseGuards(JwtAuthGuard)
	// async turnOnTwoFactorAuthentication(
	//   @Req() request,
	//   @Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto
	// ) {
	//   const isCodeValid = this.twofaService.isTwoFactorAuthenticationCodeValid(
	// 	twoFactorAuthenticationCode,
	// 	request.user
	//   );
	//   if (!isCodeValid) {
	// 	throw new UnauthorizedException('Wrong authentication code');
	//   }
	//   this.usersService.turnOnTwoFactorAuthentication(request.user.id);
	// }

	// @Get('turn-off')
	// @HttpCode(200)
	// @UseGuards(JwtAuthGuard)
	// async turnOffTwoFactorAuthentication(
	//   @Req() request,
	// ) {
	//   await this.usersService.turnOffTwoFactorAuthentication(request.user.id);
	// }

}
