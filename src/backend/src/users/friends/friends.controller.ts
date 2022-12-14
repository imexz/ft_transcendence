import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-two/jwt-auth.guard';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
    constructor(
		private readonly friendsService: FriendsService ){}

    @Get()
	@UseGuards(JwtAuthGuard)
	getFriends(@Request() req): any {
		return this.friendsService.getFriendst(req.user.id)
		// return this.usersService.getFriends(req.user.id)
	}
}
