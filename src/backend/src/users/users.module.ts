import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwofsModule } from 'src/twofa/twofa.module';
import { AuthModule } from '../auth/auth.module';
import User from './entitys/user.entity';
import { FriendsModule } from './friends/friends.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	// imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
	imports: [TypeOrmModule.forFeature([User]), TwofsModule, forwardRef(() => AuthModule), FriendsModule],
	providers: [UsersService],
	controllers: [UsersController],
	exports: [TypeOrmModule, UsersService]
})
export class UsersModule {}
