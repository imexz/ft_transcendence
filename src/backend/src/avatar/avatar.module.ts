import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fileEntity } from './file.entitys';  
import { AvatarService } from './avatar.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AvatarController } from './avatar.controller';


@Module({
	imports: [TypeOrmModule.forFeature([fileEntity]), UsersModule],
	providers: [AvatarService],
	controllers: [AvatarController],
    exports: [TypeOrmModule]
})
export class AvatarModule {}

