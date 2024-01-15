import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    origin: [
      'http://localhost:4200',
      'http://localhost:3000',
      'http://localhost:9000',
      'localhost:3000',
      'localhost:4200',
      '192.168.0.152',
    ],
    credentials: true,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'PATCH', 'DELETE'],
  });
  const options = new DocumentBuilder()
    .setTitle('STACK BLOG API')
    .setDescription('')
    .setVersion('1.0')
    .addTag('STACK BLOG API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(process.env.PORT);

  console.log(`Application is running on port ${process.env.PORT}`);
}

bootstrap();
