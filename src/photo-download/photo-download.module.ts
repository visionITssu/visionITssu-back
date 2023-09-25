import { Module } from '@nestjs/common';
import { PhotoDownloadController } from './photo-download.controller';
import { PhotoDownloadService } from './photo-download.service';

@Module({
  controllers: [PhotoDownloadController], // Include the controller
  providers: [PhotoDownloadService], // Include any services
})
export class PhotoDownloadModule {}
