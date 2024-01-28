import { PrismaService } from '@/infrastructure/database/prisma.service';
import { jest } from '@jest/globals';
import { HeartRepository } from './heart.repository';
import { DATABASE_ERROR } from '@/common/contants/error';
import { HeartRepositoryInterface } from './heart.repository.interface';

jest.mock('@/infrastructure/database/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    hearts: {
      aggregate: jest.fn(),
    },
  })),
}));

describe('HeartRepository', () => {
  let heartRepository: HeartRepositoryInterface;
  let mockPrismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    mockPrismaService = new PrismaService() as jest.Mocked<PrismaService>;
    heartRepository = new HeartRepository(mockPrismaService);
  });

  describe('getTotalHearts', () => {
    it('should return total number of hearts for a given member', async () => {
      const memberId = 'member-id';
      jest.mocked(mockPrismaService.hearts.aggregate).mockResolvedValueOnce({
        _sum: { quantity: 10 },
        _count: { quantity: 1 },
        _avg: { quantity: 10 },
        _min: { quantity: 10 },
        _max: { quantity: 10 },
      });

      const totalHearts = await heartRepository.getTotalHearts(memberId);

      expect(
        jest.mocked(mockPrismaService.hearts.aggregate),
      ).toHaveBeenCalledWith({
        where: { memberId },
        _sum: { quantity: true },
      });
      expect(totalHearts).toEqual(10);
    });

    it('should return 0 if no hearts found', async () => {
      const memberId = 'member-id';
      jest.mocked(mockPrismaService.hearts.aggregate).mockResolvedValueOnce({
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
      const memberId = 'member-id';
      jest
        .mocked(mockPrismaService.hearts.aggregate)
        .mockRejectedValue(new Error(DATABASE_ERROR));

      await expect(heartRepository.getTotalHearts(memberId)).rejects.toThrow(
        DATABASE_ERROR,
      );
    });
  });
});
