import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { MessageModule } from 'src/message/message.module';
import { MessageService } from 'src/message/message.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { chatroom } from '../chatroom/chatroom.entity';
import { message } from '../message/message.entity';
import { User } from '../users/entitys/user.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
	imports: [ChatroomModule, UsersModule, MessageModule],
  providers: [ChatService, ChatGateway],
  exports: [],
})
export class ChatModule {}
