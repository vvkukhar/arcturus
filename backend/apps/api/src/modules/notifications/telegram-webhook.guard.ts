import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TelegramWebhookGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-telegram-bot-api-secret-token'];
    
    if (!token || token !== process.env.TELEGRAM_SECRET_TOKEN) {
      throw new UnauthorizedException('Invalid Telegram Secret Token');
    }
    
    return true;
  }
}