import { Member } from 'src/domain/entities/member';

export interface MemberServiceInterface {
  readonly createMember: (
    email: string,
    password: string,
    isAdmin: boolean,
  ) => Promise<Member>;

  readonly login: (email: string, password: string) => Promise<Member>;
}
