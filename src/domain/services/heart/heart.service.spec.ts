import { Test, TestingModule } from '@nestjs/testing';
import { HeartService } from './heart.service';
import { HeartRepositoryInterface } from '@/domain/repositories/heart/heart.repository.interface';
import { jest } from '@jest/globals';
import { Heart } from '@/domain/entities/heart';

describe('HeartService', () => {
    let service: HeartService;
    let mockHeartRepository: jest.Mocked<HeartRepositoryInterface>;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HeartService,
                {
                    provide: 'HEART_REPOSITORY',
                    useValue: {
                        getTotalHearts: jest.fn(),
                        rechargeBonusHearts: jest.fn(),
                        rechargeRegularHearts: jest.fn(),
                        getHeartRechargeHistory: jest.fn(),
                    },
                },
            ],
        }).compile();
        service = module.get<HeartService>(HeartService);
        mockHeartRepository = module.get('HEART_REPOSITORY');
    });
    it('should return total number of hearts', async () => {
        mockHeartRepository.getTotalHearts.mockResolvedValueOnce(10);
        expect(await service.getTotalHearts('member-id')).toEqual(10);
        expect(mockHeartRepository.getTotalHearts).toHaveBeenCalledWith(
            'member-id',
        );
    });
    it('should recharge bonus hearts', async () => {
        const memberId = 'test-member-id';
        const quantity = 5;
        const expiryDate = new Date();
        const expectedHeart = new Heart(
            'heart-id',
            memberId,
            'bonus',
            quantity,
            new Date(),
            expiryDate,
        );
        mockHeartRepository.rechargeBonusHearts.mockResolvedValue(
            expectedHeart,
        );
        const result = await service.rechargeBonusHearts(
            memberId,
            quantity,
            expiryDate,
        );
        expect(mockHeartRepository.rechargeBonusHearts).toHaveBeenCalledWith(
            memberId,
            quantity,
            expiryDate,
        );
        expect(result).toEqual(expectedHeart);
        expect(result.data.expiryDate).toEqual(expiryDate);
    });
    it('should recharge regular hearts', async () => {
        const memberId = 'test-member-id';
        const quantity = 10;
        const expectedHeart = new Heart(
            'heart-id',
            memberId,
            'regular',
            quantity,
        );
        mockHeartRepository.rechargeRegularHearts.mockResolvedValue(
            expectedHeart,
        );
        const result = await service.rechargeRegularHearts(memberId, quantity);
        expect(mockHeartRepository.rechargeRegularHearts).toHaveBeenCalledWith(
            memberId,
            quantity,
        );
        expect(result).toEqual(expectedHeart);
    });
    describe('getHeartRechargeHistory', () => {
        it('should retrieve heart recharge history', async () => {
            const memberId = 'test-member-id';
            const mockHistory = [
                new Heart(
                    'heart1',
                    memberId,
                    'bonus',
                    5,
                    new Date(),
                    new Date(),
                ),
                new Heart('heart2', memberId, 'regular', 10),
            ];
            mockHeartRepository.getHeartRechargeHistory.mockResolvedValue(
                mockHistory,
            );
            const result = await service.getHeartRechargeHistory(memberId);
            expect(result).toEqual(mockHistory);
            expect(
                mockHeartRepository.getHeartRechargeHistory,
            ).toHaveBeenCalledWith(memberId, undefined, 10);
        });
        it('should handle pagination in heart recharge history', async () => {
            const memberId = 'test-member-id';
            const cursor = 'heart1';
            const limit = 5;
            const mockHistory = [
                new Heart('heart2', memberId, 'regular', 10),
                new Heart(
                    'heart3',
                    memberId,
                    'bonus',
                    20,
                    new Date(),
                    new Date(),
                ),
            ];
            mockHeartRepository.getHeartRechargeHistory.mockResolvedValue(
                mockHistory,
            );
            const result = await service.getHeartRechargeHistory(
                memberId,
                cursor,
                limit,
            );
            expect(result).toEqual(mockHistory);
            expect(
                mockHeartRepository.getHeartRechargeHistory,
            ).toHaveBeenCalledWith(memberId, cursor, limit);
        });
    });
});
