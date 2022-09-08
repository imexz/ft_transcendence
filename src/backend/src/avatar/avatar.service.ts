import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from '@nestjs/common';
import { file } from './file.entitys';
import { Repository } from "typeorm";


@Injectable()
export class AvatarService {
    constructor(
        @InjectRepository(file)
        private fileRepository: Repository<file>,
    ){}
        
    getFile(id: number) {
        return this.fileRepository.findOneBy({id: id})
        
    }

    async add(file: Express.Multer.File) {
        console.log(file);
        const tmp = this.fileRepository.create({filename: file.originalname, data: file.buffer});
        console.log(tmp.filename);        
        console.log(await (await this.fileRepository.save(tmp)).id);
    }
}
