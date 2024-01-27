import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Member } from 'src/domain/entities/member';

@Injectable()
export class MemberInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Member) {
          const {
            fields: { password, ...result },
          } = data;
          return result;
        }
        return data;
      }),
    );
  }
}
