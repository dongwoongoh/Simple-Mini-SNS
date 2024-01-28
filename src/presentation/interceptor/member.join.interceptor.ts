import { Member } from '@/domain/entities/member';
import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    Scope,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';

@Injectable({ scope: Scope.DEFAULT })
export class MemberJoinInterceptor implements NestInterceptor {
    private hasPasswordKey(obj: any): obj is { password: any } {
        return obj && typeof obj === 'object' && 'password' in obj;
    }
    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest() as Request;
        const body = request.body;
        if (this.hasPasswordKey(body))
            body.password = await bcrypt.hash(body.password, 10);
        else throw new BadRequestException();
        return next.handle().pipe(map((data) => data));
    }
}
