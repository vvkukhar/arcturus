import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TelegramWebhookGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-telegram-bot-api-secret-token'];
    const configuredToken = process.env.TELEGRAM_SECRET_TOKEN;
    
    // Якщо в .env немає токена — пропускаємо запит
    if (!configuredToken) {
      return true;
    }
    
    // Якщо токен налаштований, але телеграм надіслав неправильний — блокуємо
    if (token !== configuredToken) {
      throw new UnauthorizedException('Invalid Telegram Secret Token');
    }
    
    return true;
  }
}