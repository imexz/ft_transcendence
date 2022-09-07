import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from './entitys/user.entity'
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module'
import { DatabasFile } from './entitys/databaseFile.entitys';

@Module({
	imports: [TypeOrmModule.forFeature([User, DatabasFile])],
	providers: [UsersService],
	exports: [TypeOrmModule, UsersService]
})
export class UsersModule {}
