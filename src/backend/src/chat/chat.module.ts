import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { chatroom } from '../chatroom/chatroom.entity';
import { message } from '../message/message.entity';
import { User } from '../users/entitys/user.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
	imports: [TypeOrmModule.forFeature([message, User, chatroom])],
  providers: [ChatService, ChatGateway],
  exports: [TypeOrmModule, ChatService],
})
export class ChatModule {}
