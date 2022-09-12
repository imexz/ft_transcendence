import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42"
import { AuthService } from "./auth.service";
import { HttpService } from '@nestjs/axios'
import { readFile } from 'fs';
import { createWriteStream } from 'fs';
import { promisify } from "util";
import { User } from "src/users/entitys/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	private readonly logger = new Logger(LocalStrategy.name)
	constructor(private authService: AuthService, private readonly httpService: HttpService) {
		super({
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: process.env.CALLBACK_URL,
			profileFields: {
				'name.givenName': 'first_name',
				'id': function (obj) { return String(obj.id); },
				'image_url': 'image_url',
			}
		});
	}

	async validate(accessToken, refreshToken, profile, cb): Promise<any> {

		// this.logger.log(profile)
		this.logger.log("validate")
		// this.logger.log(cb)

		try {
			const user = await this.authService.validateUser(profile.id);
			this.logger.log("try")

			return user;
		}
		catch (err){
			this.logger.log("catch")
			this.logger.log(profile.id)
			this.logger.log(profile.name.givenName)
			this.logger.log(profile.image_url)

			// const write = createWriteStream('./image.jpeg');

			// const response = await this.httpService.axiosRef({
			// 	url: profile.image_url,
			// 	method: 'GET',
			// 	responseType: 'stream',
			// });
	
			// const test = promisify(readFile);
			
			// response.data.pipe(write);
			// var tmp = await test('./image.jpeg');
			// this.logger.log("test")

			// this.logger.log(tmp)
			var tmp: User[];
			const user = await this.authService.addUser(new User(profile.id, profile.name.givenName, profile.image_url, null, tmp))
			// cb(err, user, err.info)
			this.logger.log("return validate")

			return user 

		}

	}
}
// https://api.intra.42.fr/oauth/authorize?response_type=code&redirect_uri=https%3A%2F%2Fnext-auth.js.org%2Fproviders%2F42-school&client_id=a05f304947e0209cad47e5e1d4cc54f7ddf69a4231ac8dafd4f7ad7ccb29c57b