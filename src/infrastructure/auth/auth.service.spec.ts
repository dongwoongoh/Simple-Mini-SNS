import { AuthService } from './auth.service';
import { MemberRepositoryInterface } from '@/domain/repositories/member/member.repository.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { Member } from '@/domain/entities/member';
import { NOT_EXIST_MEMBER } from '@/common/constants/exist';
import { NOT_MATHCED_PASSWORD } from '@/common/constants/match';

describe('AuthService', () => {
    let service: AuthService;
    let mockMemberRepository: MemberRepositoryInterface;
    let mockJwtService: JwtService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: 'MEMBER_REPOSITORY',
                    useValue: {
                        find: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                    },
                },
            ],
        }).compile();
        service = module.get<AuthService>(AuthService);
        mockMemberRepository = module.get('MEMBER_REPOSITORY');
        mockJwtService = module.get(JwtService);
    });
    describe('signIn', () => {
        const email = 'test@example.com';
        const password = 'password123';
        const member = new Member('1', email, false, password);
        it('should return an access token for valid credentials', async () => {
            jest.mocked(mockMemberRepository.find).mockResolvedValue(member);
            jest.mocked(mockJwtService.signAsync).mockResolvedValue(
                'mock-jwt-token',
            );
            const result = await service.signIn(email, password);
            expect(result.access_token).toEqual('mock-jwt-token');
            expect(mockJwtService.signAsync).toHaveBeenCalledWith({
                id: member.data.id,
                email: member.data.email,
                isAdmin: member.data.isAdmin,
            });
        });
        it('should throw an error for invalid password', async () => {
            jest.mocked(mockMemberRepository.find).mockResolvedValue(
                new Member('1', email, false, 'password'),
            );
            await expect(service.signIn(email, password)).rejects.toThrow(
                NOT_MATHCED_PASSWORD,
            );
        });
        it('should throw an error if the member does not exist', async () => {
            jest.mocked(mockMemberRepository.find).mockResolvedValue(null);
            await expect(service.signIn(email, password)).rejects.toThrow(
                NOT_EXIST_MEMBER,
            );
        });
    });
});
