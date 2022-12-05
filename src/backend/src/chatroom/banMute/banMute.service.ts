import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminAction } from 'src/users/entitys/admin.enum';
import User from 'src/users/entitys/user.entity';
import { Repository } from 'typeorm';
import chatroom, { Access } from '../chatroom.entity';
import { banMute } from './banMute.entity';



@Injectable()
export class BanMuteService {
    constructor(
        @InjectRepository(banMute)
        private banMuteRepository: Repository<banMute>,
        ) {}
        
        async mut( user: User, chatroom: chatroom): Promise<AdminAction> {
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
                    return AdminAction.unMuted
                }
            }
            
            var mute = this.banMuteRepository.create()
            mute.user = user
            mute.chatroom = chatroom
            this.banMuteRepository.save(mute)
            return AdminAction.muted
        }
        
        async unMute(userId: number, chatroom: chatroom) {
            //console.log("===unMute===");
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
