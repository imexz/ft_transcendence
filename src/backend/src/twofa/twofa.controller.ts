import { Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import TwoFactorAuthenticationCodeDto from "../auth/dto/turnOnTwoFactorAuthentication.dto";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";
import { TwofaService } from "./twofa.service";


@Controller('twofa')
export class TwoFactorAuthenticationController {
    constructor(
        private readonly twoFactorAuthenticationService: TwofaService,
        private readonly authService: AuthService
        ) {}


    @Post('generate')
    @UseGuards(JwtAuthGuard)
    async register(@Res() response: Response, @Req() request) {
        const { otpauthUrl } = await this.twoFactorAuthenticationService.genaatetwofaSecret(request.user);

        return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
    }

    @Post('authenticate')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async authenticate(
    @Req() request,
    @Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto
    ) {
        const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
            twoFactorAuthenticationCode, request.user
        );
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }

        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user.id, true);

        request.res.setHeader('Set-Cookie', [accessTokenCookie]);

        return request.user;
    }

}