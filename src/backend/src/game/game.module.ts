import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entities/game.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), AuthModule, UsersModule, JwtModule.register({
    // imports: [HttpModule, UsersModule, PassportModule, JwtModule.register({
      secret: process.env.JWT_PASSWORD,
      signOptions: { expiresIn: '600s'}
    })],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [TypeOrmModule, GameService],
})
export class GameModule {}
