import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserHttpModule } from './users/users-http.module';
import { User } from './users/user.entity'
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
	UserHttpModule,
	ConfigModule.forRoot({
		envFilePath: '../database/.env',
	}),
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'database',
		port: 5432,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: '',
		entities: [User],
		// synchronize: true //  shouldn't be used in production
	}),
	AuthModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
