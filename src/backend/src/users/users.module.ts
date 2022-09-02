import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from './user.entity'
import { UsersService } from './users.service';
import { AuthModule } from '../aut/auth.module'

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UsersService],
	exports: [TypeOrmModule, UsersService]
})
export class UsersModule {}
