import { Member } from '@/domain/entities/member';

export interface MemberServiceInterface {
    readonly join: (
        email: string,
        password: string,
        isAdmin: boolean,
    ) => Promise<Member>;
}
