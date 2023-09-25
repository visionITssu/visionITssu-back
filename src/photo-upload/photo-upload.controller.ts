import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoUploadService } from './photo-upload.service';
import { MulterOptions } from './multer.options';
@Controller('photo-upload')
export class PhotoUploadController {
    constructor(private readonly photoUploadService: PhotoUploadService){}

    @Post()
    @UseInterceptors(FileInterceptor('file', MulterOptions))
    photoUpload(@UploadedFile() file: Express.Multer.File){
        console.log('1234');
        return `${file.originalname} File Upload check http:localhost:3000/uploads/${file.filename}`;
    }
}
