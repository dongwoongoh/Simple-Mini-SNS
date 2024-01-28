export interface HeartServiceInterface {
  readonly getTotalHearts: (memberId: string) => Promise<number>;
  readonly rechargeBonusHearts: (
    memberId: string,
    quantity: number,
    expiryDate: Date,
  ) => Promise<void>;
}
