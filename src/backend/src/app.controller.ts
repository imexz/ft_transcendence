import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './aut/local-auth.guard'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Get('auth/login')
  async login(@Request() req) {
	  return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Get('auth/login/callback')
  callback() {
    return 'succes';
  }
}
