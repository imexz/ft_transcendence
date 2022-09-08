import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from './entitys/user.entity'
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module'
import { UsersController } from './users.controller';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UsersService],
	exports: [TypeOrmModule, UsersService]
})
export class UsersModule {}
