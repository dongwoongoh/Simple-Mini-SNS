import { Member } from 'src/domain/entities/member';

export interface MemberRepositoryInterface {
  readonly createUser: (
    email: string,
    password: string,
    isAdmin: boolean,
  ) => Promise<Member>;
  readonly findUserByEmail: (email: string) => Promise<Member | null>;
}
