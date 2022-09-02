import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserHttpModule } from './users/users-http.module';
import { User } from './users/user.entity'
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
	UserHttpModule,
	ConfigModule.forRoot({
		envFilePath: '../../database/.env',
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
		username:'initdb',
		password: 'thisisnotasafepasswordl0l',
		database: 'initdb',
		entities: [],
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
