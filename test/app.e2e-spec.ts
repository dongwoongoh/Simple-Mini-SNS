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
import { LoginMemberDto } from '@/presentation/dtos/login.member.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const req: CreateMemberDto = {
    email: 'mad@gmail.com',
    password: '12345678!!',
    isAdmin: false,
  };

  let member: Member;

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
      const { id, email } = response.body;
      member = new Member(id, req.email, req.password, req.isAdmin);
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

  describe('POST /members/login', () => {
    const resource = '/members/login';
    const data: LoginMemberDto = {
      email: req.email,
      password: req.password,
    };
    it('201', async () => {
      const response = await request(app.getHttpServer())
        .post(resource)
        .send(data)
        .expect(201);
      const { email } = response.body;
      expect(email).toStrictEqual(data.email);
    });
    it('422', async () => {
      const data: LoginMemberDto = {
        email: req.email,
        password: 'req.password',
      };
      await request(app.getHttpServer()).post(resource).send(data).expect(422);
    });
  });

  describe('GET /hearts', () => {
    const resource = '/hearts';
    it('200 init value 0', async () => {
      const response = await request(app.getHttpServer())
        .get(`${resource}/${member.fields.id}`)
        .expect(200);
      const { totalHearts } = response.body;
      expect(totalHearts).toStrictEqual(0);
    });
  });
});
