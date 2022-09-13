import {  Delete, Controller, Post, UseInterceptors, UploadedFile, MaxFileSizeValidator, FileTypeValidator, ParseFilePipe, Get, UseGuards, Param, Res, StreamableFile, Header } from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarService } from './avatar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService){}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  uploadFileAndPassValidation(
    @Res({ passthrough: true }) res,
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
      this.avatarService.add(res.user.id, file)
  }

  @Get()
  @Header('Content-Type', 'image/jpeg')
	@UseGuards(JwtAuthGuard)
  async getAvatar(@Res({ passthrough: true }) res) {
      return new StreamableFile((await this.avatarService.getFile(res.user.id)).data)
  }

  @Delete()
	@UseGuards(JwtAuthGuard)
  deleteAvatar(@Res({ passthrough: true }) res) {
    this.avatarService.delete(res.user.id)
  }


}

