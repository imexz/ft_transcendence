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
		console.log("validateUser");
		return null;
	}

	async addUser(id: number, name: string) {
		const user = await this.usersService.add(id, name)
		if(user) {
			return user
		}
		console.log("addUser");
		return null
	}

	async findOrCreate(id: number, name: string) {
		const user = this.validateUser(id)
		if (user) {
			return user
		} else {
			return this.addUser(id, name)
		}
	}
}
