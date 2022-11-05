import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './42/42.strategy';
import { ConfigModule } from '@nestjs/config';
import { LocalAuthGuard } from './42/local-auth.guard';
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-two/jwt.strategy';
import { Jwt2Strategy } from './jwt-first/jwt.strategy2';
import { HttpModule } from '@nestjs/axios';
import { GameModule } from 'src/game/game.module';


@Module({
	imports: [HttpModule, UsersModule, PassportModule, ConfigModule.forRoot(), JwtModule.register({
	// imports: [HttpModule, UsersModule, PassportModule, JwtModule.register({
    secret: process.env.JWT_PASSWORD,
    signOptions: { expiresIn: '600s'}
  }), forwardRef(() => GameModule)],
  providers: [AuthService, LocalStrategy, LocalAuthGuard, JwtStrategy, Jwt2Strategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, Jwt2Strategy],
})
export class AuthModule {}
