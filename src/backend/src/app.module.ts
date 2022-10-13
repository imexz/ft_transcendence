import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entitys/user.entity'
import { fileEntity } from './avatar/file.entitys'
import { AvatarController } from './avatar/avatar.controller';
import { AvatarService } from './avatar/avatar.service';
import { AvatarModule } from './avatar/avatar.module';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './chat/chat.gateway';
import { MessageService } from './message/message.service';
import { ChatroomService } from './chatroom/chatroom.service';
import { MessageModule } from './message/message.module';
import { message } from './message/message.entity';
import { chatroom } from './chatroom/chatroom.entity';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { GameController } from './game/game.controller';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';
import { Game } from './game/game.entities/game.entity';
import { TwofsModule } from './twofa/twofa.module';
import { UsersController } from './users/users.controller';
import { ChatroomModule } from './chatroom/chatroom.module';
import { Friend } from './users/friends/friend.entity';



@Module({
  imports: [
	AuthModule,
	UsersModule,
	TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		useFactory: (configService: ConfigService) => ({
		type:'postgres',
		host: 'database',
		port: 5432,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.PGDATABASE,
		entities: [User, fileEntity, message, chatroom, Game],
		ssl: false,
		synchronize: true //  shouldn't be used in production
	}),
	inject: [ConfigService],
}),
	AvatarModule,
	// MessageModule,
	ChatModule,
	GameModule,
	TwofsModule,
	ChatroomModule,
	Friend,
],
	// controllers: [GameController],
	// providers: [ChatGateway, MessageService, ChatroomService, GameService, GameGateway, ChatGateway, MessageService, ChatroomService],
	// providers: [ChatGateway, MessageService, ChatroomService, GameService, MessageService, ChatroomService],
	// providers: [ChatGateway],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
