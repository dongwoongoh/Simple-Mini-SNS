export class Heart {
    constructor(
        private readonly id: string,
        private readonly memberId: string,
        private readonly type: 'regular' | 'bonus',
        private readonly quantity: number,
        private readonly chargedAt: Date,
        private readonly expiryDate?: Date,
    ) {}
    public get data() {
        return {
            id: this.id,
            memberId: this.memberId,
            type: this.type,
            quantity: this.quantity,
            chargedAt: this.chargedAt,
            expiryDate: this.expiryDate,
        };
    }
}
