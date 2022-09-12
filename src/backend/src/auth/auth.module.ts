import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './42.strategy';
import { ConfigModule } from '@nestjs/config';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { HttpModule } from '@nestjs/axios';


@Module({
	imports: [HttpModule, UsersModule, PassportModule, ConfigModule.forRoot(), JwtModule.register({
    secret: process.env.SWT_PASSWORD,
    signOptions: { expiresIn: '600s'}
  })],
  providers: [AuthService, LocalStrategy, LocalAuthGuard, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
