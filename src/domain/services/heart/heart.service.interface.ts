import { Heart } from '@/domain/entities/heart';

export interface HeartServiceInterface {
    readonly getTotalHearts: (memberId: string) => Promise<number>;
    readonly rechargeBonusHearts: (
        memberId: string,
        quantity: number,
        expiryDate: Date,
    ) => Promise<Heart>;
}
