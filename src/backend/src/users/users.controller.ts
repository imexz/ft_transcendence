import { Controller, Get, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';

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

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		console.log(file)
	}
}
