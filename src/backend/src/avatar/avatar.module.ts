import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { file } from './file.entitys';  
import { AvatarService } from './avatar.service';

@Module({
	imports: [TypeOrmModule.forFeature([file])],
	providers: [AvatarService],
    exports: [TypeOrmModule]
})
export class AvatarModule {}

