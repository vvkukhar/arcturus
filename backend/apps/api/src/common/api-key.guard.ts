import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const configuredKey = process.env.INTERNAL_API_KEY;

    if (!configuredKey) {
      return true;
    }

    const headerKey = request.headers['x-api-key'];

    if (!headerKey || headerKey !== configuredKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}