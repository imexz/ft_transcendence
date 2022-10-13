import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { User } from './entitys/user.entity'
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module'
import { UsersController } from './users.controller';
import { TwofsModule } from 'src/twofa/twofa.module';
import { FriendsController } from './friends/friends.controller';
import { FriendsService } from './friends/friends.service';
import { FriendsModule } from './friends/friends.module';

@Module({
	// imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
	imports: [TypeOrmModule.forFeature([User]), TwofsModule, forwardRef(() => AuthModule), FriendsModule],
	providers: [UsersService],
	controllers: [UsersController],
	exports: [TypeOrmModule, UsersService]
})
export class UsersModule {}
