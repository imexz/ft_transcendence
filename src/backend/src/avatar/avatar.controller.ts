import { Controller, Post, UseInterceptors, UploadedFile, MaxFileSizeValidator, FileTypeValidator, ParseFilePipe, Get, UseGuards, Param, Res, StreamableFile, Header } from '@nestjs/common';
import { file } from './file.entitys';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarService } from './avatar.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('avatar')
export class AvatarController {
    constructor(private readonly avatarService: AvatarService){}

    @Post('file')
    @UseInterceptors(FileInterceptor('file'))
	// @UseGuards(JwtAuthGuard)
    uploadFileAndPassValidation(
    //   @Body() body: SampleDto,
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
        this.avatarService.add(file)
    }

    @Get(':id')
    @Header('Content-Type', 'image/jpeg')
	// @UseGuards(JwtAuthGuard)
    async getAvatar(@Param('id') id: number) {
      console.log(id);
      
        return new StreamableFile((await this.avatarService.getFile(id)).data, )
    }



}
function createReadStream(arg0: file) {
  throw new Error('Function not implemented.');
}

