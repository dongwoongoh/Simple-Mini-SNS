import { Injectable, Inject } from '@nestjs/common';
import { HeartRepositoryInterface } from '@/domain/repositories/heart/heart.repository.interface';
import { HeartServiceInterface } from './heart.service.interface';

@Injectable()
export class HeartService implements HeartServiceInterface {
    constructor(
        @Inject('HEART_REPOSITORY')
        private heartRepository: HeartRepositoryInterface,
    ) {}
    async getTotalHearts(memberId: string): Promise<number> {
        return await this.heartRepository.getTotalHearts(memberId);
    }
}
