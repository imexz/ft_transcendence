import {  Delete, Controller, Request, Post, Param, UseInterceptors, UploadedFile, MaxFileSizeValidator, FileTypeValidator, ParseFilePipe, Get, UseGuards, Res, StreamableFile, Header } from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarService } from './avatar.service';
import { JwtAuthGuard } from '../auth/jwt-two/jwt-auth.guard';


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
          new MaxFileSizeValidator({ maxSize: 1073741824 }),
          new FileTypeValidator({ fileType: 'jpeg' }),
        ]
      })
    )
    file: Express.Multer.File,
  ) {
      return await this.avatarService.add(req.user.id, file)
  }

  @Get(':id')
  @Header('Content-Type', 'image/jpeg')
	@UseGuards(JwtAuthGuard)
  async getAvatar(@Param('id') id: number) {

    let file = await this.avatarService.getFile(id)
      if (file)
        return new StreamableFile(file.data)
      else
      {
        // CHANGE HERE TO 404 !!!!!!
        return {undefined}
      }
  }

  @Delete()
	@UseGuards(JwtAuthGuard)
  async deleteAvatar(@Request() req) {
    return await this.avatarService.delete(req.user.id)
  }
}

