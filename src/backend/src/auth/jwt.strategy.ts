import { PassportStrategy } from "@nestjs/passport";
import { Passport } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

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
}