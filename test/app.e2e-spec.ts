import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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

  describe('Member', () => {
    const resource = '/members';
    it('POST /members - success', async () => {
      const response = await request(app.getHttpServer())
        .post(resource)
        .send(req)
        .expect(201);
      const { email } = response.body;
      const member = new Member('1', req.email, req.password, req.isAdmin);
      expect(member.fields.email).toEqual(email);
    });
    it('409', () => {
      return request(app.getHttpServer()).post(resource).send(req).expect(409);
    });
  });
});
