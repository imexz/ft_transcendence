import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { AvatarModule } from './avatar/avatar.module';
import { fileEntity } from './avatar/file.entitys';
import { ChatModule } from './chat/chat.module';
import { banMute } from './chatroom/banMute/banMute.entity';
import chatroom from './chatroom/chatroom.entity';
import { ChatroomModule } from './chatroom/chatroom.module';
import { Game } from './game/game.entities/game.entity';
import { GameModule } from './game/game.module';
import { message } from './message/message.entity';
import { TwofsModule } from './twofa/twofa.module';
import User from './users/entitys/user.entity';
import { Friend } from './users/friends/friend.entity';
import { FriendsModule } from './users/friends/friends.module';
import { UsersModule } from './users/users.module';




@Module({
  imports: [
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
			entities: [User, fileEntity, message, chatroom, Game, Friend, banMute],
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
	FriendsModule,
	AuthModule,
	JwtModule.register({
		// imports: [HttpModule, UsersModule, PassportModule, JwtModule.register({
		  secret: process.env.JWT_PASSWORD,
		  signOptions: { expiresIn: '600s'}
		})
],
	// controllers: [GameController],
	// providers: [ChatGateway, MessageService, ChatroomService, GameService, GameGateway, ChatGateway, MessageService, ChatroomService],
	// providers: [ChatGateway, MessageService, ChatroomService, GameService, MessageService, ChatroomService],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
