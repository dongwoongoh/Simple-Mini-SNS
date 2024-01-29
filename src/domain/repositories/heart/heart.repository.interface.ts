export interface HeartRepositoryInterface {
    readonly getTotalHearts: (memberId: string) => Promise<number>;
}
