import { jest } from '@jest/globals';
import { HeartRepository } from './heart.repository';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { UNEXCEPTION_ERROR } from '@/common/constants/unexception';

jest.mock('@/infrastructure/prisma/prisma.service', () => ({
    PrismaService: jest.fn().mockImplementation(() => ({
        hearts: {
            aggregate: jest.fn(),
        },
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
});
