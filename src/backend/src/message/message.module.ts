import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entitys/user.entity';
import { message } from './message.entity';
import { MessageService } from './message.service';

@Module({
	imports: [],
	providers: [MessageService],
	exports: []
})
export class MessageModule {}
