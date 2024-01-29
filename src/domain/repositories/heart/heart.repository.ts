import { Inject, Injectable, Scope } from '@nestjs/common';
import { HeartRepositoryInterface } from './heart.repository.interface';
import { Prisma, PrismaClient } from '@prisma/client';
import { UNEXCEPTION_ERROR } from '@/common/constants/unexception';
import { Heart } from '@/domain/entities/heart';

@Injectable({ scope: Scope.DEFAULT })
export class HeartRepository implements HeartRepositoryInterface {
    constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}
    public async getTotalHearts(memberId: string): Promise<number> {
        try {
            const currentDateTime = new Date();
            const count = await this.prisma.hearts.aggregate({
                where: {
                    memberId,
                    OR: [
                        { type: 'regular' },
                        {
                            type: 'bonus',
                            expiryDate: {
                                gte: currentDateTime,
                            },
                        },
                    ],
                },
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
    public async rechargeRegularHearts(
        memberId: string,
        quantity: number,
    ): Promise<Heart> {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                return await prisma.hearts.create({
                    data: {
                        memberId,
                        quantity,
                        type: 'regular',
                    },
                });
            });
            return new Heart(
                result.id,
                result.memberId,
                result.type as 'regular',
                result.quantity,
                result.chargedAt,
            );
        } catch (error) {
            throw new Error(UNEXCEPTION_ERROR);
        }
    }
    public async useHearts(
        memberId: string,
        quantityToUse: number,
    ): Promise<void> {
        try {
            const currentDateTime = new Date();
            await this.prisma.$transaction(async (prisma) => {
                const [totalBonusHearts, totalRegularHearts] =
                    await Promise.all([
                        prisma.hearts.aggregate({
                            where: {
                                memberId,
                                type: 'bonus',
                                expiryDate: {
                                    gt: currentDateTime,
                                },
                            },
                            _sum: {
                                quantity: true,
                            },
                        }),
                        prisma.hearts.aggregate({
                            where: {
                                memberId,
                                type: 'regular',
                            },
                            _sum: {
                                quantity: true,
                            },
                        }),
                    ]);
                const totalHearts =
                    (totalBonusHearts._sum.quantity || 0) +
                    (totalRegularHearts._sum.quantity || 0);
                if (quantityToUse > totalHearts) {
                    throw new Error('Insufficient hearts');
                }
                let remainingQuantityToUse = quantityToUse;
                const bonusHearts = await prisma.hearts.findMany({
                    where: {
                        memberId,
                        type: 'bonus',
                        expiryDate: {
                            gt: currentDateTime,
                        },
                    },
                });
                for (const heart of bonusHearts) {
                    if (remainingQuantityToUse <= 0) break;
                    const usableQuantity = Math.min(
                        heart.quantity,
                        remainingQuantityToUse,
                    );
                    remainingQuantityToUse -= usableQuantity;
                    if (heart.quantity > usableQuantity) {
                        await prisma.hearts.update({
                            where: { id: heart.id },
                            data: { quantity: heart.quantity - usableQuantity },
                        });
                    } else {
                        await prisma.hearts.delete({
                            where: { id: heart.id },
                        });
                    }
                }
                if (remainingQuantityToUse > 0) {
                    const regularHearts = await prisma.hearts.findMany({
                        where: {
                            memberId,
                            type: 'regular',
                        },
                    });
                    for (const heart of regularHearts) {
                        if (remainingQuantityToUse <= 0) break;
                        const usableQuantity = Math.min(
                            heart.quantity,
                            remainingQuantityToUse,
                        );
                        remainingQuantityToUse -= usableQuantity;
                        if (heart.quantity > usableQuantity) {
                            await prisma.hearts.update({
                                where: { id: heart.id },
                                data: {
                                    quantity: heart.quantity - usableQuantity,
                                },
                            });
                        } else {
                            await prisma.hearts.delete({
                                where: { id: heart.id },
                            });
                        }
                    }
                }
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            } else if (error instanceof Error) {
                throw new Error(`Error: ${error.message}`);
            } else {
                throw new Error(UNEXCEPTION_ERROR);
            }
        }
    }
}
