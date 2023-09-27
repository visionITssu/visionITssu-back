import { Controller, Get, Param, Res } from '@nestjs/common';
import { PhotoUploadController } from 'src/photo-upload/photo-upload.controller';
import { PhotoUploadModule } from 'src/photo-upload/photo-upload.module';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as mime from 'mime-types';

@Controller('photo-download')
export class PhotoDownloadController {
  @Get(':filename') // Correctly define the route parameter
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {

    const filePath = path.join(process.cwd(), 'src', 'uploads', filename);
   
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    // Set the Content-Type header based on the file's MIME type
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // Set the Content-Disposition header to prompt for download with the original file name
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}
