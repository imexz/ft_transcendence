import { PassportStrategy } from "@nestjs/passport";
import { Passport } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request as RequestType} from "express"

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: true, // need to be false
            secretOrKey: process.env.SWT_PASSWORD,
        })
    }

    async validate(payload: any) {
        console.log(payload);
        console.log("validate jwt")
         return {
            id: payload.sub,
            Name: payload.name,
         };
    }

    private static extractJWT(req: RequestType): string | null {
        console.log("extractJWT jwt")
        // console.log(req.cookies)
        if (
            req.cookies &&
          'token' in req.cookies
        //  && req.cookies.l > 0
        ) {
        console.log("extractJWT jwt sucess")

          return req.cookies.token;
        }
        console.log("extractJWT jwt null")

        return null;
      }
}