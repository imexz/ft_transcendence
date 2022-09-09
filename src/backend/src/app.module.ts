import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entitys/user.entity'
import { fileEntity } from './avatar/file.entitys'
import { AvatarController } from './avatar/avatar.controller';
import { AvatarService } from './avatar/avatar.service';
import { AvatarModule } from './avatar/avatar.module';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './chat/chat.gateway';



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
		// username: configService.get('POSTGRES_USER'),
		// password: configService.get('POSTGRES_PASSWORD'),
		// database: configService.get('PGDATABASE'),
		// username:'initdb',
		// password: 'thisisnotasafepasswordl0l',
		// database: 'initdb',
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.PGDATABASE,
		entities: [User, fileEntity],
		ssl: false,
		synchronize: true //  shouldn't be used in production
	}),
	inject: [ConfigService],
}),
	AvatarModule,
],
  providers: [ChatGateway],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
