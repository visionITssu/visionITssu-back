import { Module } from '@nestjs/common';
import { PhotoUploadController } from './photo-upload.controller';
import { PhotoUploadService } from './photo-upload.service';
import {ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports : [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    })
  ],
  controllers: [PhotoUploadController],
  providers: [PhotoUploadService],
})
export class PhotoUploadModule {}
