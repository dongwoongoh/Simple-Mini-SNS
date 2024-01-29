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
});
