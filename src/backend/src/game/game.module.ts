import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entities/game.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), UsersModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [TypeOrmModule],
})
export class GameModule {}
