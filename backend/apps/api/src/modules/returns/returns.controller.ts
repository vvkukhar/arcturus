import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { ReturnsService } from './returns.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Get()
  list(
    @Query('status') status?: string,
    @Query('q') q?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.returnsService.list({
      status,
      q,
      limit: limit ? Number(limit) : 200,
    });
  }

  @Get('board')
  board(): Promise<{
    requested: unknown[];
    approved: unknown[];
    rejected: unknown[];
    resolved: unknown[];
  }> {
    return this.returnsService.board();
  }

  @Get('stats')
  stats(): Promise<unknown> {
    return this.returnsService.stats();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<unknown> {
    return this.returnsService.getById(id);
  }

  @Post()
  create(@Body() body: CreateReturnDto): Promise<unknown> {
    return this.returnsService.create(body);
  }

  @Patch()
  update(@Body() body: UpdateReturnDto): Promise<unknown> {
    return this.returnsService.update(body);
  }

  @Patch('approve')
  approve(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.returnsService.approve(body.id);
  }

  @Patch('reject')
  reject(
    @Body()
    body: {
      id: string;
      adminNote?: string | null;
    },
  ): Promise<unknown> {
    return this.returnsService.reject(body.id, body.adminNote ?? null);
  }

  @Patch('resolve')
  resolve(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.returnsService.resolve(body.id);
  }
}