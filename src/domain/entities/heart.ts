export class Heart {
    constructor(
        private readonly id: string,
        private readonly memberId: string,
        private readonly type: 'regular' | 'bonus',
        private readonly quantity: number,
        private readonly expiryDate?: Date,
    ) {}
    public get data() {
        return {
            id: this.id,
            memberId: this.memberId,
            type: this.type,
            quantity: this.quantity,
            expiryDate: this.expiryDate,
        };
    }
}
