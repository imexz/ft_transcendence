import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './42.strategy';
import { ConfigModule } from '@nestjs/config';
import { LocalAuthGuard } from './local-auth.guard'

@Module({
	imports: [UsersModule, PassportModule, ConfigModule.forRoot()],
  providers: [AuthService, LocalStrategy, LocalAuthGuard],
})
export class AuthModule {}
