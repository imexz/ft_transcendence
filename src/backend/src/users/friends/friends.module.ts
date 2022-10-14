import { Module, forwardRef } from '@nestjs/common';
import { Friend } from './friend.entity';
import { TwofsModule } from 'src/twofa/twofa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module'
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { UsersModule } from '../users.module';


@Module({
	imports: [TypeOrmModule.forFeature([Friend]), TwofsModule, forwardRef(() => AuthModule), forwardRef(() =>UsersModule)],
    providers: [FriendsService],
    controllers: [FriendsController],
    exports: [TypeOrmModule, FriendsService]

})
export class FriendsModule {}
