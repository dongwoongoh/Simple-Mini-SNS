import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    const config = new DocumentBuilder()
        .setTitle('Thinksflow')
        .setDescription('The Thinksflow API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000, () =>
        console.log('api docs: http://localhost:3000/api'),
    );
}
bootstrap();
