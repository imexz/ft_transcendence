import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entitys/user.entity';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {}
	async validateUser(id: number): Promise<any> {
		console.log("validateUser");
		const user = await this.usersService.findOne(id)
		if(user) {
			return user
		}
		return null;
	}

	async addUser(user: User) {
		console.log("addUser");
		const tmp = await this.usersService.addUser(user)
		if(tmp) {
			console.log("add Succesfull");
			console.log(user);
			return tmp
		}
		console.log("add goes wrong");

		return null
	}


	async findAll() {
		return await this.usersService.findAll();
	}

	async login(user: any) {
		const payload = { name: user.Name, sub: user.id};

		return {
			access_token: this.jwtService.sign(payload),
		}
	}

	async addfriend(user_id: number, friend_id: number) {
		this.usersService.addfriend(user_id, friend_id)


	}
}
