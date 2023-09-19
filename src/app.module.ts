import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CameraModule } from './camera/camera.module';
import { PhotoUploadModule } from './photo-upload/photo-upload.module';
import { CalculateModule } from './calculate/calculate.module';
import { PhotoEditModule } from './photo-edit/photo-edit.module';
import { VerificationModule } from './verification/verification.module';
import { PhotoDownloadService } from './photo-download/photo-download.service';
import { PhotoDownloadController } from './photo-download/photo-download.controller';
import { PhotoDownloadModule } from './photo-download/photo-download.module';

@Module({
  imports: [
    CameraModule,
    PhotoUploadModule,
    CalculateModule,
    PhotoEditModule,
    VerificationModule,
    PhotoDownloadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
