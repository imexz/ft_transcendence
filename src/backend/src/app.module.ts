import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserHttpModule } from './users/users-http.module';
import { User } from './users/user.entity'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
	UserHttpModule,
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'database',
		port: 5432,
		username: 'shacky',
		password: 'thisisnotasafepasswordl0l',
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
