import { Controller, Post, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PhotoEditService } from './photo-edit.service';

@Controller('photo-edit')
export class PhotoEditController {
    constructor(private readonly photoEditService: PhotoEditService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async editPhoto(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        try {
            const result = await this.photoEditService.getEdit(file);

            // 결과를 Base64로 변환하여 응답으로 보냄
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ message: 'An error occurred during photo editing' });
        }
    }
}
