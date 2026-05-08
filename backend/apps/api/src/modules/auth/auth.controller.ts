import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser, CurrentUserPayload } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { extractAuthToken } from './token.utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body()
    body: {
      email?: string;
      password?: string;
      token?: string;
      rememberMe?: boolean;
    },
    @Res({ passthrough: true }) response: Response,
  ): Promise<unknown> {
    const result = await this.authService.login(body);

    const maxAge = body.rememberMe 
      ? 1000 * 60 * 60 * 24 * 30 
      : 1000 * 60 * 60 * 24;

    response.cookie('arcturus_admin_token', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge,
    });

    return result;
  }

  @Post('register')
  async register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      inviteCode: string;
    },
    @Res({ passthrough: true }) response: Response,
  ): Promise<unknown> {
    const result = await this.authService.register(body);

    response.cookie('arcturus_admin_token', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: CurrentUserPayload): Promise<unknown> {
    return this.authService.me(user.id);
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Headers('authorization') authorization: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ ok: true }> {
    const token =
      extractAuthToken(request) ?? authorization?.replace('Bearer ', '') ?? '';

    response.cookie('arcturus_admin_token', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(0),
    });

    return this.authService.logout(token);
  }
}