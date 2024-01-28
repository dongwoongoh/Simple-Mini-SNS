export interface HeartRepositoryInterface {
  readonly getTotalHearts: (userId: string) => Promise<number>;
  readonly rechargeBonusHearts: (
    memberId: string,
    quantity: number,
    expiryDate: Date,
  ) => Promise<void>;
}
