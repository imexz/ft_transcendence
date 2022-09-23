import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { User } from './entitys/user.entity'
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module'
import { UsersController } from './users.controller';
import { TwofsModule } from 'src/twofa/twofa.module';

@Module({
	// imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
	imports: [TypeOrmModule.forFeature([User]), TwofsModule],
	providers: [UsersService],
	controllers: [UsersController],
	exports: [TypeOrmModule, UsersService]
})
export class UsersModule {}
