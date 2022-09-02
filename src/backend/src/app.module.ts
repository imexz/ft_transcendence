import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserHttpModule } from './users/users-http.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './aut/auth.module';
import { User } from './users/user.entity'


@Module({
  imports: [
	AuthModule,
	UserHttpModule,
	ConfigModule.forRoot({
		isGlobal: true
		// envFilePath: '../database/.env',
	}),
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
		entities: [User],
		ssl: false,
		synchronize: true //  shouldn't be used in production
	}),
	inject: [ConfigService],
}),

],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
