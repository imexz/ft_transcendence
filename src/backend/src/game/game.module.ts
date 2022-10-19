import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entities/game.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), AuthModule, JwtModule.register({
    // imports: [HttpModule, UsersModule, PassportModule, JwtModule.register({
      secret: process.env.JWT_PASSWORD,
      signOptions: { expiresIn: '600s'}
    })],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [TypeOrmModule],
})
export class GameModule {}
