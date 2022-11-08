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
        ) {}
        
        mut( user: User, chatroom: chatroom) {
            
            var mute = this.banMuteRepository.create()
            mute.user = user
            mute.chatroom = chatroom
            this.banMuteRepository.save(mute)
        }
        
        async unMute(userId: number, chatroom: chatroom) {
            console.log("===unMute===");
            await this.banMuteRepository.delete({
                chatroom: {
                    roomId: chatroom.roomId
                },
                user:{
                    id: userId
                } }
            )
        }
    // async test(chatroom_id: number) {
    //     return await this.banMuteRepository.createQueryBuilder("mute")
    //     .innerJoinAndSelect('mute.chatroom', 'chatroom', 'chatroom._id = :id', {id: chatroom_id} )
    // }
    



}
