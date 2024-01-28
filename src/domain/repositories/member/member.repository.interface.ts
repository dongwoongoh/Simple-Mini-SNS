import { Member } from '@/domain/entities/member';

export interface MemberRepositoryInterface {
    readonly create: (
        email: string,
        password: string,
        isAdmin: boolean,
    ) => Promise<Member>;
    readonly find: (email: string) => Promise<Member>;
}
