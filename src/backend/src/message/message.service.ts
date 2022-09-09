import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { message } from './message.entity';
import { User } from 'src/users/entitys/user.entity';

@Injectable()
export class MessageService {

}
