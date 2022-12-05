import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";
import { TokenPayload } from "../tokenPayload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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
            ignoreExpiration: false, // need to be false !!!!!!!!!!!!!!!
            secretOrKey: process.env.JWT_PASSWORD
        })
    }

    async validate(payload: TokenPayload) {
    // async validate(payload: any) {
      // console.log("validate jwt")
        // console.log(payload);
        const user = await this.userService.getUser(payload.Id)
        // console.log(user);
        if (user != undefined) {
          if(user.isTwoFactorAuthenticationEnabled == false) {
            return user
          } else {
            if (payload.isSecondFactorAuthenticated) {
              return user;
            } else {
              // console.log("return null");
              return
            }
          }
        } else {
          // console.log("user not found");

        }
    }

    private static extractJWT(req: Request): string | null {
        // console.log("extractJWT jwt")
        // console.log(req.header)
        if (
            req.cookies &&
          'Authentication' in req.cookies
        //  && req.cookies.l > 0
        ) {
        // console.log("extractJWT jwt sucess")
        // console.log(req.cookies.Authentication);

          // return req.cookies.token;
          return req.cookies.Authentication;
        }
        // console.log("extractJWT jwt null")
          // console.log(req);

        return;
      }
}
