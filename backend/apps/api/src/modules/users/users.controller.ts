import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list(
    @Query('q') q?: string,
    @Query('role') role?: string,
    @Query('active') active?: string,
  ): Promise<unknown[]> {
    return this.users.list({
      q,
      role,
      active:
        active === 'true' ? true : active === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<unknown> {
    return this.users.getById(id);
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      email?: string | null;
      role?: string | null;
    },
  ): Promise<unknown> {
    return this.users.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      email?: string | null;
      role?: string | null;
      active?: boolean;
    },
  ): Promise<unknown> {
    return this.users.update(id, body);
  }
}