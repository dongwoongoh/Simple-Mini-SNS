import { Injectable, Inject } from '@nestjs/common';
import { HeartRepositoryInterface } from '@/domain/repositories/heart/heart.repository.interface';
import { HeartServiceInterface } from './heart.service.interface';
import { Heart } from '@/domain/entities/heart';

@Injectable()
export class HeartService implements HeartServiceInterface {
    constructor(
        @Inject('HEART_REPOSITORY')
        private readonly heartRepository: HeartRepositoryInterface,
    ) {}
    public async getTotalHearts(memberId: string): Promise<number> {
        return await this.heartRepository.getTotalHearts(memberId);
    }
    public async rechargeBonusHearts(
        memberId: string,
        quantity: number,
        expiryDate: Date,
    ): Promise<Heart> {
        return await this.heartRepository.rechargeBonusHearts(
            memberId,
            quantity,
            expiryDate,
        );
    }
    public async rechargeRegularHearts(
        memberId: string,
        quantity: number,
    ): Promise<Heart> {
        return await this.heartRepository.rechargeRegularHearts(
            memberId,
            quantity,
        );
    }
    public async useHearts(memberId: string, quantity: number): Promise<void> {
        return await this.heartRepository.useHearts(memberId, quantity);
    }
    public async getHeartRechargeHistory(
        memberId: string,
        cursor?: string,
        limit: number = 10,
    ): Promise<Heart[]> {
        return await this.heartRepository.getHeartRechargeHistory(
            memberId,
            cursor,
            limit,
        );
    }
}
