import { AuthService } from './auth.service';
import { MemberRepository } from '@/domain/repositories/member/member.repository';
import { JwtService } from '@nestjs/jwt';
import { Member } from '@/domain/entities/member';

describe('AuthService', () => {
  let authService: AuthService;
  let mockMemberRepository: jest.Mocked<MemberRepository>;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    mockMemberRepository = {
      findUserByEmail: jest.fn(),
    } as any;

    mockJwtService = {
      signAsync: jest.fn(),
    } as any;

    authService = new AuthService(mockMemberRepository, mockJwtService);
  });

  describe('login', () => {
    const member = new Member('1', 'test@example.com', 'hashedpassword', false);
    it('should return tokens and member data on successful login', async () => {
      mockMemberRepository.findUserByEmail.mockResolvedValue(member);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await authService.login('test@example.com', 'password');
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result.member).toBeInstanceOf(Member);
    });

    it('should return null for invalid credentials', async () => {
      const { email, password } = member.fields;
      mockMemberRepository.findUserByEmail.mockResolvedValue(null);
      const result = await authService.login(email, password);
      expect(result).toBeNull();
    });
  });
});
