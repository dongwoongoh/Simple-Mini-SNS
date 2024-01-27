import { Member } from '@/domain/entities/member';

export interface AuthServiceInterface {
  readonly login: (
    email: string,
    password: string,
  ) => Promise<{ member: Member; access_token: string; refresh_token }>;
}
