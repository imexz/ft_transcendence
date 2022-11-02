import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import User from './users/entitys/user.entity'
import { fileEntity } from './avatar/file.entitys'
import { AvatarModule } from './avatar/avatar.module';
import { UsersModule } from './users/users.module';
import { message } from './message/message.entity';
import { chatroom } from './chatroom/chatroom.entity';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { Game } from './game/game.entities/game.entity';
import { TwofsModule } from './twofa/twofa.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { Friend } from './users/friends/friend.entity';
import { FriendsModule } from './users/friends/friends.module';
import { JwtModule } from '@nestjs/jwt';
import { banMute } from './chatroom/banMute/banMute.entity';




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
