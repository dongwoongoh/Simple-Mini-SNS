import { jest } from '@jest/globals';
import { HeartRepository } from './heart.repository';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { UNEXCEPTION_ERROR } from '@/common/constants/unexception';
import { Heart } from '@/domain/entities/heart';

jest.mock('@/infrastructure/prisma/prisma.service', () => ({
    PrismaService: jest.fn().mockImplementation(() => ({
        hearts: {
            aggregate: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        $transaction: jest.fn(),
    })),
}));

describe('HeartRepository', () => {
    let heartRepository: HeartRepository;
    let mockPrismaService: jest.Mocked<PrismaService>;
    beforeEach(() => {
        mockPrismaService = new PrismaService() as jest.Mocked<PrismaService>;
        mockPrismaService.hearts.aggregate.mockClear();
        heartRepository = new HeartRepository(mockPrismaService);
    });
    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-01-29T21:17:29.488Z'));
    });
    afterAll(() => {
        jest.useRealTimers();
    });
    describe('getTotalHearts', () => {
        const memberId = 'member-id';
        it('should return total number of hearts for a given member', async () => {
            jest.mocked(
                mockPrismaService.hearts.aggregate,
            ).mockResolvedValueOnce({
                _sum: { quantity: 10 },
                _count: { quantity: 1 },
                _avg: { quantity: 10 },
                _min: { quantity: 10 },
                _max: { quantity: 10 },
            });
            const totalHearts = await heartRepository.getTotalHearts(memberId);
            expect(totalHearts).toEqual(10);
        });
        it('should return 0 if no hearts found', async () => {
            jest.mocked(
                mockPrismaService.hearts.aggregate,
            ).mockResolvedValueOnce({
                _sum: { quantity: null },
                _count: { quantity: 0 },
                _avg: { quantity: null },
                _min: { quantity: null },
                _max: { quantity: null },
            });
            const totalHearts = await heartRepository.getTotalHearts(memberId);
            expect(totalHearts).toEqual(0);
        });
        it('should throw an error on database failure', async () => {
            jest.mocked(
                mockPrismaService.hearts.aggregate,
            ).mockRejectedValueOnce(new Error(UNEXCEPTION_ERROR));

            await expect(
                heartRepository.getTotalHearts(memberId),
            ).rejects.toThrow(UNEXCEPTION_ERROR);
        });
    });
    describe('rechargeBonusHearts', () => {
        const memberId = 'member-id';
        const quantity = 20;
        const expiryDate = new Date();
        it('should successfully recharge bonus hearts', async () => {
            const expectedHeart = new Heart(
                '100',
                memberId,
                'bonus',
                quantity,
                new Date(),
                expiryDate,
            );
            jest.mocked(mockPrismaService.$transaction).mockImplementation(
                async (cb) => cb(mockPrismaService),
            );
            jest.mocked(mockPrismaService.hearts.create).mockResolvedValue({
                id: '100',
                memberId: memberId,
                type: 'bonus',
                quantity: quantity,
                chargedAt: new Date(),
                expiryDate: expiryDate,
            });
            const result = await heartRepository.rechargeBonusHearts(
                memberId,
                quantity,
                expiryDate,
            );
            expect(result).toEqual(expectedHeart);
            expect(mockPrismaService.$transaction).toHaveBeenCalled();
            expect(mockPrismaService.hearts.create).toHaveBeenCalledWith({
                data: {
                    memberId,
                    quantity,
                    expiryDate,
                    type: 'bonus',
                },
            });
        });
        it('should throw an error on database failure', async () => {
            jest.mocked(mockPrismaService.$transaction).mockImplementation(
                async (cb) => cb(mockPrismaService),
            );
            jest.mocked(mockPrismaService.hearts.create).mockRejectedValue(
                new Error(UNEXCEPTION_ERROR),
            );
            await expect(
                heartRepository.rechargeBonusHearts(
                    memberId,
                    quantity,
                    expiryDate,
                ),
            ).rejects.toThrow(UNEXCEPTION_ERROR);
        });
    });
    describe('rechargeRegularHearts', () => {
        const memberId = 'member-id';
        const quantity = 20;
        it('should successfully recharge regular hearts', async () => {
            const expectedHeart = new Heart(
                '200',
                memberId,
                'regular',
                quantity,
                new Date(),
            );
            jest.mocked(mockPrismaService.$transaction).mockImplementation(
                async (cb) => cb(mockPrismaService),
            );
            jest.mocked(mockPrismaService.hearts.create).mockResolvedValue({
                id: '200',
                memberId: memberId,
                type: 'regular',
                quantity: quantity,
                chargedAt: new Date(),
                expiryDate: null,
            });
            const result = await heartRepository.rechargeRegularHearts(
                memberId,
                quantity,
            );
            expect(result).toEqual(expectedHeart);
            expect(mockPrismaService.$transaction).toHaveBeenCalled();
            expect(mockPrismaService.hearts.create).toHaveBeenCalledWith({
                data: {
                    memberId,
                    quantity,
                    type: 'regular',
                },
            });
        });
        it('should throw an error on database failure', async () => {
            jest.mocked(mockPrismaService.$transaction).mockImplementation(
                async (cb) => cb(mockPrismaService),
            );
            jest.mocked(mockPrismaService.hearts.create).mockRejectedValue(
                new Error(UNEXCEPTION_ERROR),
            );
            await expect(
                heartRepository.rechargeRegularHearts(memberId, quantity),
            ).rejects.toThrow(UNEXCEPTION_ERROR);
        });
    });
    describe('useHearts', () => {
        const memberId = 'member-id';
        const currentDateTime = new Date();
        it('should successfully use hearts when sufficient', async () => {
            const quantityToUse = 15;
            mockPrismaService.hearts.aggregate
                .mockResolvedValueOnce({
                    _sum: { quantity: 10 },
                    _avg: {},
                    _min: {},
                    _max: {},
                    _count: {},
                })
                .mockResolvedValueOnce({
                    _sum: { quantity: 10 },
                    _avg: {},
                    _min: {},
                    _max: {},
                    _count: {},
                });
            mockPrismaService.hearts.findMany
                .mockResolvedValueOnce([
                    {
                        id: '1',
                        memberId: '1',
                        quantity: 10,
                        type: 'bonus',
                        chargedAt: new Date(),
                        expiryDate: new Date('2024-03-19'),
                    },
                ])
                .mockResolvedValueOnce([
                    {
                        id: '2',
                        memberId: '2',
                        quantity: 10,
                        type: 'regular',
                        chargedAt: new Date(),
                        expiryDate: null,
                    },
                ]);

            await heartRepository.useHearts(memberId, quantityToUse);
        });

        it('should ignore expired bonus hearts', async () => {
            const quantityToUse = 15;
            mockPrismaService.hearts.aggregate
                .mockResolvedValueOnce({
                    _sum: { quantity: 0 },
                    _avg: {},
                    _min: {},
                    _max: {},
                    _count: {},
                })
                .mockResolvedValueOnce({
                    _sum: { quantity: 10 },
                    _avg: {},
                    _min: {},
                    _max: {},
                    _count: {},
                });

            await heartRepository.useHearts(memberId, quantityToUse);
        });
    });
    describe('getHeartRechargeHistory', () => {
        const memberId = 'member-id';
        const cursorId = 'cursor-id';
        const limit = 10;

        it('should return heart recharge history', async () => {
            const mockHearts = [
                {
                    id: '1',
                    memberId: 'member-id',
                    type: 'bonus',
                    quantity: 5,
                    chargedAt: new Date('2024-01-01T00:00:00Z'),
                    expiryDate: new Date('2024-06-01T00:00:00Z'),
                },
                {
                    id: '2',
                    memberId: 'member-id',
                    type: 'regular',
                    quantity: 10,
                    chargedAt: new Date('2024-01-02T00:00:00Z'),
                    expiryDate: null,
                },
            ];
            mockPrismaService.hearts.findMany.mockResolvedValue(mockHearts);
            const result = await heartRepository.getHeartRechargeHistory(
                memberId,
                cursorId,
                limit,
            );
            expect(result).toEqual(
                mockHearts.map(
                    (heart) =>
                        new Heart(
                            heart.id,
                            heart.memberId,
                            heart.type as 'regular' | 'bonus',
                            heart.quantity,
                            heart.chargedAt,
                            heart.expiryDate,
                        ),
                ),
            );
            expect(mockPrismaService.hearts.findMany).toHaveBeenCalledWith({
                where: {
                    memberId,
                    id: {
                        gt: cursorId,
                    },
                },
                take: 10,
                orderBy: {
                    chargedAt: 'desc',
                },
            });
        });
        it('should handle empty recharge history', async () => {
            mockPrismaService.hearts.findMany.mockResolvedValue([]);
            const result = await heartRepository.getHeartRechargeHistory(
                memberId,
                cursorId,
                limit,
            );
            expect(result).toEqual([]);
        });
        it('should throw an error on database failure', async () => {
            mockPrismaService.hearts.findMany.mockRejectedValue(
                new Error(UNEXCEPTION_ERROR),
            );
            await expect(
                heartRepository.getHeartRechargeHistory(
                    memberId,
                    cursorId,
                    limit,
                ),
            ).rejects.toThrow(UNEXCEPTION_ERROR);
        });
    });
});
