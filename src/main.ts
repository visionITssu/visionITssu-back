import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Express } from 'express';
import * as path from 'path'; // Import the path module

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;

  app.enableCors({
    origin: '*',
  });

  app.useStaticAssets(join(__dirname, '../..', 'static'));
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(port, () => {
    const logger = new Logger('Bootstrap'); // Bootstrap은 로그의 컨텍스트입니다. 원하는 대로 변경 가능
    logger.log(`Server is running on http://localhost:${port}`);
  });
}
bootstrap();
