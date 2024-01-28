import { Inject, Injectable, Scope } from '@nestjs/common';
import { HeartServiceInterface } from './heart.service.interface';
import { HeartRepositoryInterface } from '@/domain/repositories/heart/heart.repository.interface';

@Injectable({ scope: Scope.DEFAULT })
export class HeartService implements HeartServiceInterface {
  constructor(
    @Inject('HEART_REPOSITORY')
    private readonly heartRepository: HeartRepositoryInterface,
  ) {}

  public async getTotalHearts(memberId: string) {
    return await this.heartRepository.getTotalHearts(memberId);
  }
}
