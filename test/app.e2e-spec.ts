import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { CreateMemberDto } from '@/presentation/dtos/create.member.dto';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { Member } from '@/domain/entities/member';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const req: CreateMemberDto = {
    email: 'mad@gmail.com',
    password: '12345678!!',
    isAdmin: false,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
    prismaService = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prismaService.members.deleteMany({
      where: {
        email: req.email,
      },
    });
  });

  describe('POST /members', () => {
    const resource = '/members';
    it('422', async () => {
      const silly_form: CreateMemberDto = {
        email: 'integral@gmail.com',
        password: '12345',
        isAdmin: true,
      };
      await request(app.getHttpServer())
        .post(resource)
        .send(silly_form)
        .expect(422);
    });
    it('201', async () => {
      const response = await request(app.getHttpServer())
        .post(resource)
        .send(req)
        .expect(201);
      const { email } = response.body;
      const member = new Member('1', req.email, req.password, req.isAdmin);
      expect(member.fields.email).toEqual(email);
    });
    it('409', async () => {
      const response = await request(app.getHttpServer())
        .post(resource)
        .send(req)
        .expect(409);
      expect(response.body).toStrictEqual({
        statusCode: 409,
        message: 'email',
        error: 'Conflict',
      });
    });
  });
});
