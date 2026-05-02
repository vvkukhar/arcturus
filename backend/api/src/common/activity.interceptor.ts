import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { ActivityService } from '../modules/activity/activity.service';

type RequestLike = {
  url?: string;
  method?: string;
  body?: unknown;
};

@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  constructor(private readonly activity: ActivityService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestLike>();

    return next.handle().pipe(
      tap({
        next: () => {
          const route = request.url ?? 'unknown_route';
          const method = request.method ?? 'UNKNOWN';

          void this.activity.log(`${method} ${route}`, {
            body: request.body ?? null,
          });
        },
      }),
    );
  }
}