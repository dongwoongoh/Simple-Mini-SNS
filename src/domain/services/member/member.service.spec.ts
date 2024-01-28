import { MemberRepositoryInterface } from '@/domain/repositories/member/member.repository.interface';
import { MemberServiceInterface } from './member.service.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { Member } from '@/domain/entities/member';

describe('MemberService', () => {
    let service: MemberServiceInterface;
    let mockMemberRepository: MemberRepositoryInterface;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: 'MEMBER_REPOSITORY',
                    useValue: {
                        create: jest.fn(),
                        find: jest.fn(),
                    },
                },
                MemberService,
            ],
        }).compile();
        service = module.get<MemberServiceInterface>(MemberService);
        mockMemberRepository = module.get('MEMBER_REPOSITORY');
    });
    describe('join', () => {
        const memberData = {
            email: 'test@example.com',
            password: 'password123',
            isAdmin: false,
        };
        it('should create a new member', async () => {
            const member = new Member(
                '1',
                memberData.email,
                memberData.isAdmin,
            );
            jest.mocked(mockMemberRepository.create).mockResolvedValue(member);
            const result = await service.join(
                memberData.email,
                memberData.password,
                memberData.isAdmin,
            );
            expect(result.data).toEqual(member.data);
        });
    });
});
