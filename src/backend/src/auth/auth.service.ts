import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entitys/user.entity';
import {TokenPayload} from './tokenPayload.interface';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {}
	
	validateUser(id: number): Promise<any> {
		console.log("validateUser");
		try {
			const user = this.usersService.getUser(id);
			console.log("all good");
			return user;
		} catch(err) {
			console.log("validateUser error");
			console.log(err);
			throw err;
		}
	}

	addUser(user: User) {
		return  this.usersService.addUser(user);
	}


	async findAll() {
		return await this.usersService.findAll();
	}

	login(user: any) {
		const payload = {sub: user.id};
		return this.jwtService.sign(payload);
	}

	async addfriend(user_id: number, friend_id: number) {
		this.usersService.addfriend(user_id, friend_id)


	}

	async deleteUser(user_id: number) {
		this.usersService.remove(user_id);
	}

	public getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated = false) {
		const payload: TokenPayload = {userId, isSecondFactorAuthenticated };
		const token = this.jwtService.sign(payload);
		return `token=${token}; HttpOnly; Path=/; Max-Age=2000}`;
	}
}
