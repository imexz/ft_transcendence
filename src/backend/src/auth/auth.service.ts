import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}
	async validateUser(id: number): Promise<any> {
		const user = await this.usersService.findOne(id)
		if(user) {
			return user
		}
		return null;
	}
}
