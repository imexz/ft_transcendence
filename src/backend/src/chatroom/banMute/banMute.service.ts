import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/entitys/user.entity';
import chatroom from '../chatroom.entity';
import { ChatroomService } from '../chatroom.service';
import { banMute } from './banMute.entity';
import { AdminAction } from 'src/users/entitys/admin.enum';



@Injectable()
export class BanMuteService {
    constructor(
        @InjectRepository(banMute)
        private banMuteRepository: Repository<banMute>,
        private chatroomService: ChatroomService
        ) {}

    action(action: AdminAction, user: User, chatroom: chatroom) {
        console.log("action", action);
        
        var mute = this.banMuteRepository.create()
        mute.user = user
        mute.chatroom = chatroom
        mute.type = action
        this.banMuteRepository.save(mute)
        if (action == AdminAction.baned) {
            this.chatroomService.removeUserFromChatroom(user, chatroom.roomName)
        }
    }

    // async test(chatroom_id: number) {
    //     return await this.banMuteRepository.createQueryBuilder("mute")
    //     .innerJoinAndSelect('mute.chatroom', 'chatroom', 'chatroom._id = :id', {id: chatroom_id} )
    // }
    



}
