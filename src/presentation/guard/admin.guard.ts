import { parseCookie } from '@/application/helper/parse.cookie';
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly service: JwtService) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest() as Request;
        const token = parseCookie(request.headers.cookie)['token'];
        try {
            const decoded = this.service.verify(token, { secret: 'SECRET' });
            return decoded.isAdmin;
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw new ForbiddenException();
            } else if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}
