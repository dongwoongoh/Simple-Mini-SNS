import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/application/container/app.module';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { MemberJoinDto } from '@/presentation/dtos/member/member.join.dto';
import { Member } from '@/domain/entities/member';
import { Heart } from '@/domain/entities/heart';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;
    let member: Member;
    let heart: Heart;
    let rMember: Member;
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
        isAdmin: true,
    };
    afterAll(async () => {
        await prismaService.hearts.deleteMany({
            where: { id: heart.data.id },
        });
        await prismaService.members.deleteMany({
            where: { email: gMember.email },
        });
        await prismaService.members.deleteMany({
            where: { id: rMember.data.id },
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
            const cookies = response.headers['set-cookie'];
            expect(body.id).toStrictEqual(member.data.id);
            expect(cookies).toBeDefined();
            expect(cookies[0]).toContain('token=');
            expect(cookies[0]).toContain('HttpOnly');
        });
        it('422', async () => {
            const sillyPassword = '123456qwe!!!';
            const response = await request(app.getHttpServer())
                .post(resource)
                .send({ ...gMember, password: sillyPassword })
                .expect(422);
            expect(response.body).toStrictEqual({
                statusCode: 422,
                message: 'password',
                error: 'Unprocessable Entity',
            });
        });
        it('404', async () => {
            const sillyEmail = '123456qwedz@gmail.com';
            const response = await request(app.getHttpServer())
                .post(resource)
                .send({ ...gMember, email: sillyEmail })
                .expect(404);
            expect(response.body).toStrictEqual({
                statusCode: 404,
                message: 'email',
                error: 'Not Found',
            });
        });
    });
    describe('GET /hearts', () => {
        const resource = '/hearts';
        it('200', async () => {
            await request(app.getHttpServer())
                .get(`${resource}?memberId=${member.data.id}`)
                .expect(200);
        });
    });
    describe('POST /hearts', () => {
        const resource = '/hearts/bonus';
        it('200', async () => {
            const rMemberData: MemberJoinDto = {
                email: 'mad999@gmail.com',
                password: '12345678!!',
                isAdmin: false,
            };
            const response = await request(app.getHttpServer())
                .post('/members')
                .send(rMemberData)
                .expect(201);
            const { id, email, isAdmin } = response.body;
            rMember = new Member(id, email, isAdmin);
            const loginResponse = await request(app.getHttpServer())
                .post('/auth')
                .send(gMember)
                .expect(201);
            const cookies = loginResponse.headers['authorization'];
            const heartResponse = await request(app.getHttpServer())
                .post(resource)
                .set('Cookie', cookies)
                .send({
                    memberId: rMember.data.id,
                    quantity: 2000,
                    expiryDate: new Date(),
                })
                .expect(201);
            const body = heartResponse.body;
            heart = new Heart(
                body.id,
                body.memberId,
                body.type,
                body.quantity,
                body.chargedAt,
                body.expiryDate,
            );
        });
    });
});
