import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entitys/user.entity';
import {TokenPayload} from './tokenPayload.interface';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {}
	
	async validateUser(id: number) {

			const user = await this.usersService.getUser(id);
			console.log("all good");
			return user;
	}

	addUser(user: User) {
		return  this.usersService.addUser(user);
	}


	async findAll() {
		return await this.usersService.findAll();
	}

	login(user: any) {
		const payload = {sub: user._id};
		return this.jwtService.sign(payload);
	}

	async addfriend(user_id: number, friend_id: number) {
		// this.usersService.addfriend(user_id, friend_id)


	}

	async deleteUser(user_id: number) {
		this.usersService.remove(user_id);
	}

	public getCookieWithJwtAccessToken(Id: number, isSecondFactorAuthenticated = false) {
		const payload: TokenPayload = {Id, isSecondFactorAuthenticated };
		const token = this.jwtService.sign(payload, { secret: process.env.JWT_PASSWORD, expiresIn: '600s' });
		// return token;
		// return `Authentication=${token}; HttpOnly; Path=/; Max-Age=600`;
		return `Authentication=${token}; Path=/; Max-Age=600`;
	}
}
