import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { chatroom } from '../chatroom/chatroom.entity';
import { MessageModule } from 'src/message/message.module';
import { message } from '../message/message.entity';
import { User } from '../users/entitys/user.entity';
import { ChatService } from './chat.service';

@Module({
	imports: [TypeOrmModule.forFeature([message, User, chatroom]), MessageModule],
  providers: [ChatService],
  exports: [TypeOrmModule, ChatService],
})
export class ChatModule {}
