import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from '@nestjs/common';
import { fileEntity } from './file.entitys';
import { Repository } from "typeorm";
import { UsersService } from '../users/users.service';




@Injectable()
export class AvatarService {
    constructor(
        @InjectRepository(fileEntity)
        private fileRepository: Repository<fileEntity>,
        private usersService: UsersService
    ){}
        
    getFile(id: number) {
        return await this.fileRepository.findOneBy({id: id})
    }

    async add(id: number, file: Express.Multer.File) {
        var avatar = await this.fileRepository.findOneBy({id: id})
        if(avatar == undefined) {
            avatar = this.fileRepository.create({id: id, filename: file.originalname, data: file.buffer});
        } else {
            avatar.filename = file.originalname
            avatar.data = file.buffer
        }

        await this.usersService.updateAvatar(id, await this.fileRepository.save(avatar))
    }

    async delete(id: number) {
        await this.fileRepository.delete({id: id})
        await this.usersService.updateAvatar(id, null)
    }
}
