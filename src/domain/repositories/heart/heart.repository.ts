import { Inject, Injectable, Scope } from '@nestjs/common';
import { HeartRepositoryInterface } from './heart.repository.interface';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DATABASE_ERROR } from '@/common/contants/error';

@Injectable({ scope: Scope.DEFAULT })
export class HeartRepository implements HeartRepositoryInterface {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaService) {}

  public async getTotalHearts(memberId: string): Promise<number> {
    try {
      const count = await this.prisma.hearts.aggregate({
        where: { memberId },
        _sum: { quantity: true },
      });
      return count._sum.quantity || 0;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new Error(DATABASE_ERROR);
      }
      throw error;
    }
  }
}
