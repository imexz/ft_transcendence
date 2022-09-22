import {  Delete, Controller, Request, Post, UseInterceptors, UploadedFile, MaxFileSizeValidator, FileTypeValidator, ParseFilePipe, Get, UseGuards, Res, StreamableFile, Header } from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarService } from './avatar.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';


@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService){}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  async uploadFileAndPassValidation(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000000 }),
          new FileTypeValidator({ fileType: 'jpeg' }),
        ]
      })
    )
    file: Express.Multer.File,
  ) {
      // console.log(req.user );
      
      await this.avatarService.add(req.user.id, file)
  }

  @Get()
  @Header('Content-Type', 'image/jpeg')
	@UseGuards(JwtAuthGuard)
  async getAvatar(@Request() req) {
      return new StreamableFile((await this.avatarService.getFile(req.user.id)).data)
  }

  @Delete()
	@UseGuards(JwtAuthGuard)
  async deleteAvatar(@Request() req) {
    await this.avatarService.delete(req.user.id)
  }


}

