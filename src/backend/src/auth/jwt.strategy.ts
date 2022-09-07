import { PassportStrategy } from "@nestjs/passport";
import { Passport } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express"

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true, // need to be false
            secretOrKey: process.env.SWT_PASSWORD,
        })
    }

    async validate(payload: any) {
        console.log(payload);
         return {
            id: payload.sub,
            Name: payload.name,
         };
    }

    private static extractJWT(req: Request): string | null {
        if (
          req.cookies &&
          'token' in req.cookies &&
          req.cookies.user_token.length > 0
        ) {
          return req.cookies.token;
        }
        return null;
      }
}