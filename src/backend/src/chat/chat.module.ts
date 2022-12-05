import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { MessageModule } from 'src/message/message.module';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';


@Module({
	imports: [ChatroomModule, UsersModule, MessageModule, AuthModule
    , JwtModule.register({
    // imports: [HttpModule, UsersModule, PassportModule, JwtModule.register({
      secret: process.env.JWT_PASSWORD,
      signOptions: { expiresIn: '600s'}
    })
  ],
  providers: [ChatService, ChatGateway],
  exports: [],
})
export class ChatModule {}
