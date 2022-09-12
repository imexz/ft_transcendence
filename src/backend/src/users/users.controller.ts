import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { User } from './entitys/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { response } from 'express';


@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService){}

	@Get('find:id')
	@UseGuards(JwtAuthGuard)
	findOne(@Param() params: number){
		return this.usersService.findOne(params)
	}

	@Get('allUser')
	@UseGuards(JwtAuthGuard)
	
	findAll(){
		return this.usersService.findAll()
	}

	@Post('addUser')
	@UseGuards(JwtAuthGuard)
	addUser(@Body() user: User){
		console.log(user);

		return  this.usersService.addUser(user);
	}

	@Post('addFriend')
	@UseGuards(JwtAuthGuard)
	addFriend(@Body() user: User[]){
		console.log(user);
		return  this.usersService.addfriend(user[0].id, user[1].id);
	}

	@Get('friends')
	@UseGuards(JwtAuthGuard)
	getFriends(@Res() res) {
		return this.usersService.getFriends(res.user.id)
	}

	@Get('validate')
	@UseGuards(JwtAuthGuard)
	validate(@Res() res) {
		// return this.usersService.findOne(res.user.id)
    return 'hello'
	}


	@Post('update_name')
	@UseGuards(JwtAuthGuard)
	update_name(@Body() name: string, @Res() res) {
		this.usersService.updateName(res.user.id, name);
	}

	@Delete()
	delete(@Res() res) {
		this.usersService.remove(res.user.id)
	}


}
