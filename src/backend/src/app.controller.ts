import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('test')
  login(@Request() req): string {
    return "test"; //retunr JWT
  }

//   @UseGuards(LocalAuthGuard)
//   @Get('auth/login')
//   async login(@Request() req) {
// 	  return req.user;
//   }

//   @UseGuards(LocalAuthGuard)
//   @Get('auth/login/callback')
//   callback() {
//     return 'succes';
//   }
}
