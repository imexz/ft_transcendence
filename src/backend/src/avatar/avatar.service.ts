import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from '@nestjs/common';
import { file } from './file.entitys';
import { Repository } from "typeorm";
import { UsersService } from 'src/users/users.service';




@Injectable()
export class AvatarService {
    constructor(
        @InjectRepository(file)
        private fileRepository: Repository<file>,
    ){}
        
    getFile(id: number) {
        return this.fileRepository.findOneBy({id: id})
        
    }

    add(file: Express.Multer.File) {
        this.fileRepository.create({filename: file.filename, data: file.buffer})
    }
}
