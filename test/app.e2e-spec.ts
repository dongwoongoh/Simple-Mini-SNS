import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/application/container/app.module';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { MemberJoinDto } from '@/presentation/dtos/member/member.join.dto';
import { Member } from '@/domain/entities/member';
import { HeartRechargeBonusDto } from '@/presentation/dtos/heart/heart.recharge.bonus.dto';
import { HeartUseDto } from '@/presentation/dtos/heart/heart.use';

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
        isAdmin: true,
    };
    afterAll(async () => {
        const tables = ['hearts', 'members'];
        for (const table of tables) {
            await prismaService.$executeRawUnsafe(`DELETE FROM ${table};`);
        }
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
            member = new Member(body.id, body.email, body.isAdmin);
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
            const response = await request(app.getHttpServer())
                .post('/auth')
                .send(gMember)
                .expect(201);
            const cookies = response.headers['set-cookie'];
            const result = await request(app.getHttpServer())
                .get(resource)
                .set('Cookie', cookies)
                .expect(200);
            const quantity = result.body['quantity'];
            expect(quantity).toStrictEqual(0);
        });
    });
    describe('POST /hearts/bonus', () => {
        const resource = '/hearts/bonus';
        it('200', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth')
                .send(gMember)
                .expect(201);
            const { id: memberId } = response.body;
            const data: HeartRechargeBonusDto = {
                memberId,
                quantity: 1000,
                expiryDate: new Date('2024-03-19'),
            };
            const cookies = response.headers['set-cookie'];
            const result = await request(app.getHttpServer())
                .post(resource)
                .set('Cookie', cookies)
                .send(data);
            expect(result.body.quantity).toStrictEqual(data.quantity);
        });
    });
    describe('POST /hearts/regular', () => {
        const resource = '/hearts/regular';
        it('200', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth')
                .send(gMember)
                .expect(201);
            const { id: memberId } = response.body;
            const data: HeartRechargeBonusDto = {
                memberId,
                quantity: 1700,
                expiryDate: new Date('2024-03-19'),
            };
            const cookies = response.headers['set-cookie'];
            const result = await request(app.getHttpServer())
                .post(resource)
                .set('Cookie', cookies)
                .send(data);
            expect(result.body.quantity).toStrictEqual(data.quantity);
        });
    });
    describe('POST /hearts/use', () => {
        const resource = '/hearts/use';
        it('422', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth')
                .send(gMember)
                .expect(201);
            const data: HeartUseDto = { quantity: 10000 };
            const cookies = response.headers['set-cookie'];
            const result = await request(app.getHttpServer())
                .patch(resource)
                .set('Cookie', cookies)
                .send(data)
                .expect(422);
            expect(result.body).toStrictEqual({
                statusCode: 422,
                message: 'Insufficient hearts',
                error: 'Unprocessable Entity',
            });
        });
        it('200', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth')
                .send(gMember)
                .expect(201);
            const data: HeartUseDto = { quantity: 2700 };
            const cookies = response.headers['set-cookie'];
            await request(app.getHttpServer())
                .patch(resource)
                .set('Cookie', cookies)
                .send(data)
                .expect(200);
        });
    });
});
