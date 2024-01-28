export interface HeartRepositoryInterface {
  readonly getTotalHearts: (userId: string) => Promise<number>;
}
