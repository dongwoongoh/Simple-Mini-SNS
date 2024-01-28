import { Prisma, PrismaClient } from '@prisma/client';
import { MemberRepositoryInterface } from './member.repository.interface';
import { MemberRepository } from './member.repository';
import { Member } from '@/domain/entities/member';
import { UNEXCEPTION_ERROR } from '@/common/constants/unexception';

jest.mock('@prisma/client', () => {
    const module = jest.requireActual('@prisma/client');
    return {
        _esModule: true,
        ...module,
        PrismaClient: jest.fn().mockImplementation(() => ({
            members: {
                create: jest.fn(),
                findUnique: jest.fn(),
            },
            $transaction: jest.fn(),
        })),
    };
});
describe('MemberRepository', () => {
    let repository: MemberRepositoryInterface;
    let prismaClient: PrismaClient;
    beforeEach(() => {
        prismaClient = new PrismaClient();
        repository = new MemberRepository(prismaClient);
    });
    describe('create', () => {
        const data = {
            email: 'mad@gmail.com',
            password: 'password123',
            isAdmin: true,
        };
        it('should create a new member', async () => {
            const member = { id: '_uuid', ...data };
            jest.mocked(prismaClient.members.create).mockResolvedValue(member);
            jest.mocked(prismaClient.$transaction).mockImplementation(
                async (transactionCallback) => {
                    return transactionCallback(prismaClient);
                },
            );
            const result = await repository.create(
                member.email,
                member.password,
                member.isAdmin,
            );
            const newMember = new Member(
                result.data.id,
                result.data.email,
                result.data.isAdmin,
            );
            expect(result).toStrictEqual(newMember);
            expect(prismaClient.$transaction).toHaveBeenCalled();
            expect(prismaClient.members.create).toHaveBeenCalledWith({ data });
        });
        it('should unexception error', async () => {
            const error = new Error(UNEXCEPTION_ERROR);
            jest.mocked(prismaClient.members.create).mockRejectedValue(error);
            await expect(
                repository.create(data.email, data.password, data.isAdmin),
            ).rejects.toThrow(UNEXCEPTION_ERROR);
        });
    });
});
