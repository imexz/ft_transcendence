import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { chatroom } from 'src/chatroom/chatroom.entity';
import { message } from '../message/message.entity';
import { User } from '../users/entitys/user.entity';
import { ChatService } from './chat.service';

@Module({
	imports: [TypeOrmModule.forFeature([message, User, chatroom])],
  providers: [ChatService],
  exports: [TypeOrmModule, ChatService],
})
export class ChatModule {}
