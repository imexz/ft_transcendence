import { Injectable } from '@nestjs/common';
import { banMute, Silance } from './banMute.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/entitys/user.entity';
import { chatroom } from '../chatroom.entity';



@Injectable()
export class BanMuteService {
    constructor(
        @InjectRepository(banMute)
        private banMuteRepository: Repository<banMute>
    ) {}

    Mute(user: User, chatroom: chatroom) {
        var mute = this.banMuteRepository.create()
        mute.user = user
        mute.chatroom = chatroom
        mute.type = Silance.muted
        this.banMuteRepository.save(mute)
    }

    Ban(user: User, chatroom: chatroom) {
        var mute = this.banMuteRepository.create()
        mute.user = user
        mute.chatroom = chatroom
        mute.type = Silance.baned
        this.banMuteRepository.save(mute)
    }

    async test(chatroom_id: number) {
        return await this.banMuteRepository.createQueryBuilder("mute")
        .innerJoinAndSelect('mute.chatroom', 'chatroom', 'chatroom._id = :id', {id: chatroom_id} )
    }
    



}
