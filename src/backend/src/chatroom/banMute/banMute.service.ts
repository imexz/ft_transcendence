import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/entitys/user.entity';
import chatroom, { Access } from '../chatroom.entity';
import { ChatroomService } from '../chatroom.service';
import { banMute } from './banMute.entity';
import { AdminAction } from 'src/users/entitys/admin.enum';



@Injectable()
export class BanMuteService {
    constructor(
        @InjectRepository(banMute)
        private banMuteRepository: Repository<banMute>,
        ) {}
        
        async mut( user: User, chatroom: chatroom) {
            if (chatroom.access == Access.dm) {
                const mute = await this.banMuteRepository.findOne({where: {
                    chatroom: {
                        roomId: chatroom.roomId
                    },
                    user:{
                        id: user.id
                    } 
                }})
                if (mute != undefined) {
                    this.unMute(user.id, chatroom)
                    return
                }
            }
            
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
}
