import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from 'src/game/game.module';
import { TwofsModule } from 'src/twofa/twofa.module';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../users.module';
import { Friend } from './friend.entity';
import { Gateway } from './friend.gateway';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';


@Module({
	imports: [TypeOrmModule.forFeature([Friend]),  forwardRef(() => TwofsModule), forwardRef(() => AuthModule), forwardRef(() => UsersModule), forwardRef(() => GameModule)],
    providers: [FriendsService, Gateway],
    controllers: [FriendsController],
    exports: [TypeOrmModule, FriendsService, Gateway]

})
export class FriendsModule {}
