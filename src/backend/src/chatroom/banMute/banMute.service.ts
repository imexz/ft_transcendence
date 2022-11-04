import { Injectable } from '@nestjs/common';
import { banMute, Silance } from './banMute.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/entitys/user.entity';
import { chatroom } from '../chatroom.entity';
import { ChatroomService } from '../chatroom.service';



@Injectable()
export class BanMuteService {
    constructor(
        @InjectRepository(banMute)
        private banMuteRepository: Repository<banMute>,
        private chatroomService: ChatroomService
        ) {}

    action(action: Silance, user: User, chatroom: chatroom) {
        console.log("action", action);
        
        var mute = this.banMuteRepository.create()
        mute.user = user
        mute.chatroom = chatroom
        mute.type = action
        this.banMuteRepository.save(mute)
        this.chatroomService.removeUserFromChatroom(user, chatroom.roomName)
    }

    // async test(chatroom_id: number) {
    //     return await this.banMuteRepository.createQueryBuilder("mute")
    //     .innerJoinAndSelect('mute.chatroom', 'chatroom', 'chatroom._id = :id', {id: chatroom_id} )
    // }
    



}
