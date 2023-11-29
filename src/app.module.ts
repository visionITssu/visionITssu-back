import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CameraModule } from './camera/camera.module';
import { PhotoUploadModule } from './photo-upload/photo-upload.module';
import { CalculateModule } from './calculate/calculate.module';
import { PhotoEditModule } from './photo-edit/photo-edit.module';
import { PhotoDownloadModule } from './photo-download/photo-download.module';
import { ExampleModule } from './example/example.module';
import { SocketModule } from './socket/socket.module';
import { VerificationModule } from './photo-verification/photo-verification.module';


@Module({
  imports: [
    CameraModule,
    PhotoUploadModule,
    CalculateModule,
    PhotoEditModule,
    VerificationModule,
    PhotoDownloadModule,
    ExampleModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
