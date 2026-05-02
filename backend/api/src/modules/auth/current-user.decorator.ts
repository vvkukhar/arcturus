import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUserPayload = {
  id: string;
  name: string;
  email?: string | null;
  role: string;
};

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): CurrentUserPayload | null => {
    const request = context.switchToHttp().getRequest();
    return request.user ?? null;
  },
);