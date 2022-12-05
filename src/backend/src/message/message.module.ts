import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { message } from './message.entity';
import { MessageService } from './message.service';

@Module({
	imports: [TypeOrmModule.forFeature([message])],
	providers: [MessageService],
	exports: [TypeOrmModule, MessageService]
})
export class MessageModule {}

