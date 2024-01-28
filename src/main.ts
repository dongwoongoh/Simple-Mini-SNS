import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    BadRequestException,
    UnprocessableEntityException,
    ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors) => {
                const isMissingFields = errors.some((error) =>
                    Object.values(error.constraints).some((constraint) =>
                        constraint.includes('should not be empty'),
                    ),
                );

                if (isMissingFields) {
                    return new BadRequestException(errors);
                } else {
                    return new UnprocessableEntityException(errors);
                }
            },
        }),
    );
    await app.listen(3000);
}
bootstrap();
