import { PassportStrategy } from "@nestjs/passport";
import { Passport } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express"
import { TokenPayload } from "../tokenPayload.interface";
import { UsersService } from "../../users/users.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
      private readonly userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            // jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
            //   return request?.cookies?.Authentication;
            // }]),
            ignoreExpiration: true, // need to be false
            secretOrKey: process.env.JWT_PASSWORD
        })
    }

    async validate(payload: any) {
        console.log(payload);
        console.log("validate jwt")
        const user = await this.userService.getUser(payload.Id)
        console.log(user);
        
        if(user.isTwoFactorAuthenticationEnabled == false) {
          console.log("user1");
          return user
        } else {
          if (payload.isSecondFactorAuthenticated) {
            console.log("user");
            return user;
          } else {
            console.log("return null");
             
            return user
          }

        }
    }

    private static extractJWT(req: Request): string | null {
        console.log("extractJWT jwt")
        console.log(req.body)
        if (
            req.cookies &&
          'Authentication' in req.cookies
        //  && req.cookies.l > 0
        ) {
        console.log("extractJWT jwt sucess")
        console.log(req.cookies);

          return req.cookies.token;
        }
        console.log("extractJWT jwt null")
          console.log(req);
          
        return;
      }
}