import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { message } from '../message/message.entity';
import { User } from '../users/entitys/user.entity';
import { ChatService } from './chat.service';

@Module({
	imports: [TypeOrmModule.forFeature([message, User])],
  providers: [ChatService]
})
export class ChatModule {}
