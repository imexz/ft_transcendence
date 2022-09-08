import { Body, Controller, Post, UseInterceptors, UploadedFile, MaxFileSizeValidator, FileTypeValidator, ParseFilePipe, Get, UseGuards, Param, Res } from '@nestjs/common';
import { file } from './file.entitys';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarService } from './avatar.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('avatar')
export class AvatarController {
    constructor(private readonly avatarService: AvatarService){}

    @Post('new')
	// @UseGuards(JwtAuthGuard)
    uploadFileAndPassValidation(
    //   @Body() body: SampleDto,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1000 }),
            new FileTypeValidator({ fileType: 'jpeg' }),
          ]
        })
      )
      file: Express.Multer.File,
    ) {
        this.avatarService.add(file)

      return {
        // body,
        file: file.buffer.toString(),
      };
    }

    @Get(':id')
	// @UseGuards(JwtAuthGuard)
    async getAvatar(@Param('id') id: number) {
        return await (await this.avatarService.getFile(id)).data
    }



}
