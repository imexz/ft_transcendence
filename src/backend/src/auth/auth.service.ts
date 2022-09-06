import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

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

	async addUser(id: number, name: string) {
		console.log("addUser");
		const user = await this.usersService.add(id, name)
		if(user) {
			console.log("add Succesfull");
			console.log(user);
			return user
		}
		console.log("add goes wrong");

		return null
	}

	async findOrCreate(id: number, name: string) {
		const user = this.validateUser(id)
		if (user) {
			return user
		} else {
			return await this.addUser(id, name)
		}
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
}
