import {  HttpException, Delete, Controller, Request, Post, Param, UseInterceptors, UploadedFile, MaxFileSizeValidator, FileTypeValidator, ParseFilePipe, Get, UseGuards, Res, StreamableFile, Header } from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarService } from './avatar.service';
import { JwtAuthGuard } from '../auth/jwt-two/jwt-auth.guard';
import { HttpStatus } from '@nestjs/common'

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

  @Get()
  emptyUserId() {
    throw new HttpException('Please provide user id', HttpStatus.BAD_REQUEST)
  }

  @Get(':id')
  @Header('Content-Type', 'image/jpeg')
	@UseGuards(JwtAuthGuard)
  async getAvatar(@Param('id') id: number) {

    if (Number.isNaN(id) || !Number.isFinite(id) || !Number.isSafeInteger(id))
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    let file = await this.avatarService.getFile(id)
      if (file)
        return new StreamableFile(file.data)
      else
      {
        throw new HttpException('id ' + id.toString() + ' was not found', HttpStatus.NOT_FOUND)
      }
  }

  @Delete()
	@UseGuards(JwtAuthGuard)
  async deleteAvatar(@Request() req) {
    return await this.avatarService.delete(req.user.id)
  }
}

