export interface HeartServiceInterface {
  readonly getTotalHearts: (memberId: string) => Promise<number>;
}
