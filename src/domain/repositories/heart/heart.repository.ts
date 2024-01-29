import { Inject, Injectable, Scope } from '@nestjs/common';
import { HeartRepositoryInterface } from './heart.repository.interface';
import { PrismaClient } from '@prisma/client';
import { UNEXCEPTION_ERROR } from '@/common/constants/unexception';
import { Heart } from '@/domain/entities/heart';

@Injectable({ scope: Scope.DEFAULT })
export class HeartRepository implements HeartRepositoryInterface {
    constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}
    public async getTotalHearts(memberId: string) {
        try {
            const count = await this.prisma.hearts.aggregate({
                where: { memberId },
                _sum: { quantity: true },
            });
            return count._sum.quantity || 0;
        } catch (error) {
            throw new Error(UNEXCEPTION_ERROR);
        }
    }
    public async rechargeBonusHearts(
        memberId: string,
        quantity: number,
        expiryDate: Date,
    ) {
        try {
            const result = await this.prisma.$transaction(
                async (tx) =>
                    await tx.hearts.create({
                        data: {
                            memberId,
                            quantity,
                            expiryDate,
                            type: 'bonus',
                        },
                    }),
            );
            return new Heart(
                result.id,
                result.memberId,
                result.type as 'bonus',
                result.quantity,
                result.chargedAt,
                result.expiryDate,
            );
        } catch (error) {
            throw new Error(UNEXCEPTION_ERROR);
        }
    }
}
