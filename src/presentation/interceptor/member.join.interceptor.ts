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
import { hasPasswordKey } from '@/application/helper/has.password.key';

@Injectable({ scope: Scope.DEFAULT })
export class MemberJoinInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest() as Request;
        const body = request.body;
        if (hasPasswordKey(body))
            body.password = await bcrypt.hash(body.password, 10);
        else throw new BadRequestException();
        return next.handle().pipe(map((data) => data));
    }
}
