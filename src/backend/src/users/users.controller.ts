import { HttpException, Body, Controller, Delete, Get, Param, Post, UseGuards, Request, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import User from './entitys/user.entity';
import { JwtAuthGuard } from '../auth/jwt-two/jwt-auth.guard';
import { TwofaService } from 'src/twofa/twofa.service';
import { FriendsService } from './friends/friends.service';
import { HttpStatus } from '@nestjs/common'


@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService,
		private readonly twofaService: TwofaService,
		private readonly friendsService: FriendsService ){}

	@Get('teapot')
	iAmATeapot() {
		throw new HttpException("I'm a teapot", HttpStatus.I_AM_A_TEAPOT)
	}

	@Get('find/:id')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	async findOne(@Param('id') params: number){
		console.log("findOne", params);
		if (Number.isNaN(params) || !Number.isFinite(params) || !Number.isSafeInteger(params))
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
		const user = await this.usersService.getUser(params);
		console.log("findOne", user);
		if (user == null || user == undefined)
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)

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


	// @Post('addUser') // can be messed up very bad with bad data input !!!!!!!!
	// @UseGuards(JwtAuthGuard)
	// @UseInterceptors(ClassSerializerInterceptor)
	// async addUser(@Body() user: User){
	// 	console.log(user);
	// 	let ret = await this.usersService.addUser(user);
	// 	if (ret.username == undefined)
	// 		throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
	// 	else
	// 		return ret
	// }



	@Get('validate')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	async validate(@Request() req): Promise<User> {

		// return await this.usersService.getUser(req.user.id)
		return req.user // test more !!!!!!
	}

	@Post('update_name')
	@UseGuards(JwtAuthGuard)
	async update_name(@Body("name") name, @Request() req) {
		console.log("inside update_name");
		console.log(req.user);
		console.log("inside update_name1");

		return this.usersService.updateName(req.user, name);
	}

	// @Delete() // needed???????
	// async delete(@Request() req) {
	// 	let test = await this.usersService.remove(req.user?.id)
	// 	console.log(test);
	// }


}
