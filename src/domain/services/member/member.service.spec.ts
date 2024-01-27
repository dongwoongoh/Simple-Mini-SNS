import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { MemberRepositoryInterface } from '@/domain/repositories/member/member.repository.interface';
import { Member } from '@/domain/entities/member';
import { EMAIL_ALREADY_EXIST } from '@/common/contants/already_exist';

describe('MemberService', () => {
  let service: MemberService;
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

    service = module.get<MemberService>(MemberService);
    mockMemberRepository = module.get('MEMBER_REPOSITROY');
  });

  it('should create a new member', async () => {
    const memberData = {
      email: 'test@example.com',
      password: 'password123',
      isAdmin: false,
    };
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
        new Member('1', 'test@example.com', 'password123', false),
      );

    await expect(
      service.createMember('test@example.com', 'password123', false),
    ).rejects.toThrow(EMAIL_ALREADY_EXIST);
  });
});
