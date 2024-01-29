import { MemberModule } from '@/application/container/member.module';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from '@/presentation/handler/auth.handler';

@Module({
    imports: [
        MemberModule,
        JwtModule.register({
            secret: 'SECRET',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
