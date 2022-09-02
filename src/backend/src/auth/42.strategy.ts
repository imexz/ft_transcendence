import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-42'
import { AuthService } from "./auth.service";
import { UnauthorizedException } from "@nestjs/common";
import { User } from "src/users/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	private readonly logger = new Logger(LocalStrategy.name)
	constructor(private authService: AuthService) {
		super({
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: process.env.CALLBACK_URL,
			profileFields: {
				// 'name.familyName': 'last_name',
				// 'id': 'id',
			}
		});
	}

	async validate(accessToken, refreshToken, profile, cb): Promise<any> {

		this.logger.log(profile)
		this.logger.log("validate")
		this.logger.log(cb)

		const user = await this.authService.validateUser(profile.id);
		if(!user) {
		this.logger.log("inside")

			// return cb(err, user)
			// throw new UnauthorizedException();
			return this.authService.addUser(profile.id, profile.first_name)
		}

		return user;
		

		return cb
	}
}

// https://api.intra.42.fr/oauth/authorize?response_type=code&redirect_uri=https%3A%2F%2Fnext-auth.js.org%2Fproviders%2F42-school&client_id=a05f304947e0209cad47e5e1d4cc54f7ddf69a4231ac8dafd4f7ad7ccb29c57b