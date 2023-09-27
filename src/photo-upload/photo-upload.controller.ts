import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoUploadService } from './photo-upload.service';
import { MulterOptions } from './multer.options';
import { ApiConsumes, ApiResponse } from '@nestjs/swagger';
@Controller('photo-upload')
export class PhotoUploadController {
    constructor(private readonly photoUploadService: PhotoUploadService){}

    @Post()
    @UseInterceptors(FileInterceptor('file', MulterOptions))
    @ApiConsumes('multipart/form-data')
    photoUpload(@UploadedFile() file: Express.Multer.File){
        //console.log('1234')
        return { message: 'Upload successful', file };
    }
}
