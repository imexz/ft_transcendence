import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import TwoFactorAuthenticationCodeDto from "../auth/dto/turnOnTwoFactorAuthentication.dto";
import { JwtAuthGuard } from "src/auth/jwt-two/jwt-auth.guard";
import { TwofaService } from "./twofa.service";
import { Jwt2AuthGuard } from "src/auth/jwt-first/jwt2-auth.guard";


@Controller('twofa')
export class TwoFactorAuthenticationController {
    constructor(
            private readonly twoFactorAuthenticationService: TwofaService,
            private readonly authService: AuthService,
            private readonly twofaService: TwofaService
        ) {}


    @Get('generate')
    @UseGuards(JwtAuthGuard)
    async register(@Res() response: Response, @Req() request) {
        const { otpauthUrl } = await this.twoFactorAuthenticationService.genaretwofaSecret(request.user);
        // this.twoFactorAuthenticationService.turnOnTwoFactorAuthentication(request.user.id)
        this.twoFactorAuthenticationService.turnOffTwoFactorAuthentication(request.user.id)
        return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
    }

    @Post('authenticate')
    @HttpCode(200)
    @UseGuards(Jwt2AuthGuard)
    async authenticate(
    @Req() request,
    @Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto
    ) {
        const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
            twoFactorAuthenticationCode,
            request.user
        );
        // console.log(isCodeValid);
        
            if (isCodeValid == false) {
                throw new UnauthorizedException('Wrong authentication code');
            }

        // const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user.id, true);

        // request.res.cookie('token', [accessTokenCookie]);

      request.res.setHeader('Set-Cookie', this.authService.getCookieWithJwtAccessToken(
        request.user.id,
        true,
      ))
        return request.user;
    }

    @Post('turn-on')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async turnOnTwoFactorAuthentication(
	  @Req() request,
	  @Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto
	) {
	  const isCodeValid = this.twofaService.isTwoFactorAuthenticationCodeValid(
		twoFactorAuthenticationCode,
		request.user
	  );
	  if (!isCodeValid) {
		throw new UnauthorizedException('Wrong authentication code');
	  }
	  this.twofaService.turnOnTwoFactorAuthentication(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookieWithJwtAccessToken(
      request.user.id,
      true,
    ))
	}

	@Get('turn-off')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async turnOffTwoFactorAuthentication(
	  @Req() request,
	) {
	  await this.twofaService.turnOffTwoFactorAuthentication(request.user.id);
	}



}
