import { Controller, Get, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService){}

	@Get(':id')
	first(@Param() params: number){
		return this.usersService.findOne(params)
	}
}
