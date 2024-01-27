import { Member } from 'src/domain/entities/member';

export interface MemberServiceInterface {
  readonly createMember: (
    email: string,
    password: string,
    isAdmin: boolean,
  ) => Promise<Member>;
}
