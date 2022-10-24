import { Module, forwardRef } from '@nestjs/common';
import { Friend } from './friend.entity';
import { TwofsModule } from 'src/twofa/twofa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module'
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { UsersModule } from '../users.module';
import { FriendGateway } from './friend.gateway';


@Module({
	imports: [TypeOrmModule.forFeature([Friend]),  TwofsModule, forwardRef(() => AuthModule), forwardRef(() => UsersModule)],
    providers: [FriendsService, FriendGateway],
    controllers: [FriendsController],
    exports: [TypeOrmModule, FriendsService]

})
export class FriendsModule {}
