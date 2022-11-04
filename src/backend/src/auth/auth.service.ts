import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GameService } from '../game/game.service';
import { JwtService } from '@nestjs/jwt';
import User from '../users/entitys/user.entity';
import {TokenPayload} from './tokenPayload.interface';
import { Socket, Server } from 'socket.io';
import { UserStatus } from 'src/users/entitys/status.enum';
import { JwtStrategy } from './jwt-two/jwt.strategy';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService, private jwtStrategy: JwtStrategy, private gameService: GameService) {}
	
	async validateUser(id: number) {

			const user = await this.usersService.getUser(id);
			// console.log("all good");
			return user;
	}

	addUser(user: User) {
		return  this.usersService.addUser(user);
	}

	login(user: any) {
		const payload = {sub: user.id};
		return this.jwtService.sign(payload);
	}

	// async addfriend(user_id: number, friend_id: number) {
	// 	// this.usersService.addfriend(user_id, friend_id)


	// }

	// async deleteUser(user_id: number) {
	// 	this.usersService.remove(user_id);
	// }

	public getCookieWithJwtAccessToken(Id: number, isSecondFactorAuthenticated = false) {
		const payload: TokenPayload = {Id, isSecondFactorAuthenticated };
		const token = this.jwtService.sign(payload, { secret: process.env.JWT_PASSWORD, expiresIn: '6000s' }); //change
		// return token;
		// return `Authentication=${token}; HttpOnly; Path=/; Max-Age=600`;
		return `Authentication=${token}; Path=/; Max-Age=6000`;
	}

	public async validateSocket(socket: Socket){
		try {
			socket.handshake.auth =  await this.jwtService.verify(socket.handshake.auth.id.replace('Authentication=',''));
			// console.log("socket handshake");
			// console.log(socket.handshake.auth);
			
			socket.handshake.auth = await this.jwtStrategy.validate(socket.handshake.auth as TokenPayload)
			// console.log("socket handshake1");
			// console.log(socket.handshake.auth);
			if(await socket.handshake.auth === undefined){
			//   console.log("validation goes wrong");
			  socket.disconnect()
			  return false
			} else {
				if (this.gameService.getGame(socket.handshake.auth._id) == undefined)
					await this.usersService.setStatus(socket.handshake.auth._id, UserStatus.ONLINE)
				else
					await this.usersService.setStatus(socket.handshake.auth._id, UserStatus.PLAYING)
					
				// console.log(socket.handshake.auth);
				return true
			}
			} catch (error) {
			//   console.log("wrong token", error);
			  socket.disconnect()
			  return false
			}
	}

}
