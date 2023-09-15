import { Module } from '@nestjs/common';
import { PhotoUploadController } from './photo-upload.controller';
import { PhotoUploadService } from './photo-upload.service';

@Module({
  controllers: [PhotoUploadController],
  providers: [PhotoUploadService]
})
export class PhotoUploadModule {}
