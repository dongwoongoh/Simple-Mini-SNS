import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { MemberRepositoryInterface } from '@/domain/repositories/member/member.repository.interface';
import { Member } from '@/domain/entities/member';
import { EMAIL_ALREADY_EXIST } from '@/common/contants/already_exist';
import { NOT_FOUND_MEMBER } from '@/common/contants/not_found';
import { MemberServiceInterface } from './member.service.interface';

describe('MemberService', () => {
  let service: MemberServiceInterface;
  let mockMemberRepository: MemberRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: 'MEMBER_REPOSITROY',
          useValue: {
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MemberServiceInterface>(MemberService);
    mockMemberRepository = module.get('MEMBER_REPOSITROY');
  });
  const memberData = {
    email: 'test@example.com',
    password: 'password123',
    isAdmin: false,
  };

  it('should create a new member', async () => {
    jest.mocked(mockMemberRepository.findUserByEmail).mockResolvedValue(null);
    jest
      .mocked(mockMemberRepository.createUser)
      .mockResolvedValue(
        new Member(
          '1',
          memberData.email,
          memberData.password,
          memberData.isAdmin,
        ),
      );

    const result = await service.createMember(
      memberData.email,
      memberData.password,
      memberData.isAdmin,
    );

    expect(result).toEqual(
      new Member(
        '1',
        memberData.email,
        memberData.password,
        memberData.isAdmin,
      ),
    );
    expect(mockMemberRepository.createUser).toHaveBeenCalledWith(
      memberData.email,
      memberData.password,
      memberData.isAdmin,
    );
  });

  it('should throw an error if email is already in use', async () => {
    jest
      .mocked(mockMemberRepository.findUserByEmail)
      .mockResolvedValue(
        new Member(
          '1',
          memberData.email,
          memberData.password,
          memberData.isAdmin,
        ),
      );

    await expect(
      service.createMember(
        memberData.email,
        memberData.password,
        memberData.isAdmin,
      ),
    ).rejects.toThrow(EMAIL_ALREADY_EXIST);
  });

  describe('login', () => {
    const loginData = {
      email: 'login@example.com',
      password: 'loginPass123',
    };

    it('should return a member for valid credentials', async () => {
      const mockMember = new Member(
        '2',
        loginData.email,
        loginData.password,
        false,
      );

      jest
        .mocked(mockMemberRepository.findUserByEmail)
        .mockResolvedValue(mockMember);

      const result = await service.login(loginData.email, loginData.password);

      expect(result.fields.email).toEqual(loginData.email);
      expect(result.fields.password).toEqual(loginData.password);
    });

    it('should throw an error for invalid credentials', async () => {
      jest.mocked(mockMemberRepository.findUserByEmail).mockResolvedValue(null);

      await expect(
        service.login(loginData.email, 'wrongPassword'),
      ).rejects.toThrow(NOT_FOUND_MEMBER);
    });
  });
});
