import { JwtStrategy } from './jwt.strategy';
import { MemberRepository } from '@/domain/repositories/member/member.repository';
import { ConfigService } from '@nestjs/config';
import { Member } from '@/domain/entities/member';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let mockMemberRepository: jest.Mocked<MemberRepository>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    mockMemberRepository = {
      findUserByEmail: jest.fn(),
    } as any;

    mockConfigService = {
      get: jest.fn().mockReturnValue('osejfosejfosejf'),
    } as any;

    jwtStrategy = new JwtStrategy(mockConfigService, mockMemberRepository);
  });

  describe('validate', () => {
    it('should return user data for valid payload', async () => {
      const payload = { email: 'test@example.com' };
      const mockMember = new Member('1', 'test@example.com', 'password', false);
      mockMemberRepository.findUserByEmail.mockResolvedValue(mockMember);

      const result = await jwtStrategy.validate(payload);
      expect(result).toBeInstanceOf(Member);
      expect(result.fields.email).toEqual(payload.email);
    });

    it('should throw an error for invalid payload', async () => {
      const payload = { email: 'wrong@example.com' };
      mockMemberRepository.findUserByEmail.mockResolvedValue(null);

      await expect(jwtStrategy.validate(payload)).rejects.toThrow(
        'Invalid token',
      );
    });
  });
});
