import { parseCookie } from '@/application/helper/parse.cookie';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class MemberGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest() as Request;
        const token = parseCookie(request.headers.cookie)['token'];
        if (!token) return false;
        try {
            const decoded = this.jwtService.verify(token, { secret: 'SECRET' });
            request.user = decoded;
            return true;
        } catch (error) {
            return false;
        }
    }
}
