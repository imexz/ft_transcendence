import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42"
import { AuthService } from "../auth.service";
import { HttpService } from '@nestjs/axios'
import { readFile } from 'fs';
import { createWriteStream } from 'fs';
import { promisify } from "util";
import User from "../../users/entitys/user.entity";
import { hostURL } from "../../hostURL";
import { UserStatus } from "src/users/entitys/status.enum";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	private readonly logger = new Logger(LocalStrategy.name)
	constructor(private authService: AuthService, private readonly httpService: HttpService) {
		super({
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: process.env.HOST + ":3000/auth/login/callback",
			profileFields: {
				'name.givenName': 'login', //username
				'id': function (obj) { return String(obj.id); },
				'image_url': function (obj) { return obj.image.link},
			}
		});
	}

	async validate(accessToken, refreshToken, profile, cb): Promise<any> {

		this.logger.log("validate")
		this.logger.log(profile.name)


		var user = await this.authService.validateUser(profile.id);
		// this.logger.log("try")
		if(user == null){
			// this.logger.log("catch")
			this.logger.log(profile.id)
			this.logger.log(profile.name.givenName)
			this.logger.log(profile.image_url)

			// this.logger.log(tmp)
			var tmp: User[];
			user = await this.authService.addUser({
				id: profile.id,
				username: profile.name.givenName,
				avatar_url: profile.image_url,
				avatar_url_42intra: profile.image_url,
				userStatus: UserStatus.ONLINE,
				isTwoFactorAuthenticationEnabled: false,
				friendStatus: null
				})
			// cb(err, user, err.info)
			this.logger.log("return validate")
		}
		return user
	}

}
// https://api.intra.42.fr/oauth/authorize?response_type=code&redirect_uri=https%3A%2F%2Fnext-auth.js.org%2Fproviders%2F42-school&client_id=a05f304947e0209cad47e5e1d4cc54f7ddf69a4231ac8dafd4f7ad7ccb29c57b