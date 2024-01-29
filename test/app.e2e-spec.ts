import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { MemberJoinDto } from '@/presentation/dtos/member/member.join.dto';
import { Member } from '@/domain/entities/member';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;
    let member: Member;
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        prismaService = app.get<PrismaService>(PrismaService);
        await app.init();
    });
    const gMember: MemberJoinDto = {
        email: 'mad@gmail.com',
        password: '12345678!!',
        isAdmin: false,
    };
    afterAll(async () => {
        await prismaService.members.deleteMany({
            where: { email: gMember.email },
        });
    });
    describe('POST /members', () => {
        const resource = '/members';
        it('201', async () => {
            const response = await request(app.getHttpServer())
                .post(resource)
                .send(gMember)
                .expect(201);
            const { id, email } = response.body;
            member = new Member(id, gMember.email, gMember.isAdmin);
            expect(member.data.email).toEqual(email);
        });
        it('409', async () => {
            await request(app.getHttpServer())
                .post(resource)
                .send(gMember)
                .expect(409);
        });
    });
    describe('POST /auth', () => {
        const resource = '/auth';
        it('201', async () => {
            const response = await request(app.getHttpServer())
                .post(resource)
                .send(gMember)
                .expect(201);
            const body = response.body;
            expect(body.id).toStrictEqual(member.data.id);
            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toContain('token=');
            expect(cookies[0]).toContain('HttpOnly');
        });
    });
});
