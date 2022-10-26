import { Injectable } from "@nestjs/common";
import User from "src/users/entitys/user.entity";
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { UsersService } from "src/users/users.service";


@Injectable()
 export class TwofaService {
    turnOffTwoFactorAuthentication(userId: number) {
        this.usersService.turnOffTwoFactorAuthentication(userId)
    }
    turnOnTwoFactorAuthentication(userId: number) {
        this.usersService.turnOnTwoFactorAuthentication(userId)
    }

    constructor(private readonly usersService: UsersService) {}

    public async genaretwofaSecret(user: User) {

        const secret = authenticator.generateSecret();

        const otpauthUrl = authenticator.keyuri(user.username,  process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME , secret);
 
        await this.usersService.setTwoFactorAuthenticationSecret(secret, user._id);
     
        return {
          secret,
          otpauthUrl
        }
    }

    public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
        return toFileStream(stream, otpauthUrl);
    }

    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        console.log('isTwoFactorAuthenticationCodeValid');
        // const tmp_user  = await this.usersService.getUser(user._id)
        
        console.log(twoFactorAuthenticationCode, user.twoFactorAuthenticationSecret);
        
        try {

            const ret = authenticator.check(
                twoFactorAuthenticationCode,
                user.twoFactorAuthenticationSecret
            )
            console.log("check=", ret);
            
            return ret
        } catch (err) {
            // Possible errors
            // - options validation
            // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
            console.error(err);
          }

    }

}

