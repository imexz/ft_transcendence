import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { UserHttpModule } from './users/users-http.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entitys/user.entity'
import { DatabasFile } from './users/entitys/databaseFile.entitys'



@Module({
  imports: [
	AuthModule,
	UserHttpModule,
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
		entities: [User, DatabasFile],
		ssl: false,
		synchronize: true //  shouldn't be used in production
	}),
	inject: [ConfigService],
}),
],
  controllers: [AppController],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
