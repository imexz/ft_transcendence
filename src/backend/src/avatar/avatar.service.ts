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
        return this.fileRepository.findOneBy({id: id})
    }

    async add(id: number, file: Express.Multer.File) {
        const tmp = this.fileRepository.create({id: id, filename: file.originalname, data: file.buffer});
        this.usersService.updateAvatar(id, await this.fileRepository.save(tmp))
    }

    async delete(id: number) {
        this.usersService.updateAvatar(id, null)
        this.fileRepository.delete({id: id})
    }
}
