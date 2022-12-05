import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FriendsModule } from 'src/users/friends/friends.module';
import { UsersModule } from 'src/users/users.module';
import { GameController } from './game.controller';
import { Game } from './game.entities/game.entity';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), forwardRef(() => AuthModule), forwardRef(() => UsersModule), forwardRef(() => FriendsModule), JwtModule.register({
      secret: process.env.JWT_PASSWORD,
      signOptions: { expiresIn: '600s'}
    })],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [TypeOrmModule, GameService, GameGateway],
})
export class GameModule {}
