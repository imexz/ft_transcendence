import { Module, forwardRef } from '@nestjs/common';
import { Friend } from './friend.entity';
import { TwofsModule } from 'src/twofa/twofa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module'
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { UsersModule } from '../users.module';
import { Gateway } from './friend.gateway';
import { GameModule } from 'src/game/game.module';


@Module({
	imports: [TypeOrmModule.forFeature([Friend]),  forwardRef(() => TwofsModule), forwardRef(() => AuthModule), forwardRef(() => UsersModule), forwardRef(() => GameModule)],
    providers: [FriendsService, Gateway],
    controllers: [FriendsController],
    exports: [TypeOrmModule, FriendsService, Gateway]

})
export class FriendsModule {}
