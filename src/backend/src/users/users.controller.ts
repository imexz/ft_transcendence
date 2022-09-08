import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { User } from './entitys/user.entity';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService){}

	@Get('find:id')
	first(@Param() params: number){
		return this.usersService.findOne(params)
	}

	@Get('all')
	second(){
		return this.usersService.findAll()
	}

	@Post('addUser')
	addUser(@Body() user: User){
		console.log(user);

		return  this.usersService.addUser(user);
	}

	@Post('addFriend')
	addFriend(@Body() user: User[]){
		console.log(user);

		return  this.usersService.addfriend(user[0].id, user[1].id);
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		console.log(file)
	}
}
