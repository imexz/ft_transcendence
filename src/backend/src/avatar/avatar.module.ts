import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import { fileEntity } from './file.entitys';


@Module({
	imports: [TypeOrmModule.forFeature([fileEntity]), UsersModule],
	providers: [AvatarService],
	controllers: [AvatarController],
    exports: [TypeOrmModule]
})
export class AvatarModule {}

