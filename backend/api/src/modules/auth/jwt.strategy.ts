import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy {
  validate(): Record<string, never> {
    return {};
  }
}