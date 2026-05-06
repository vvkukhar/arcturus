import {
  Body,
  Controller,
  Delete,
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
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  list(
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('q') q?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.expensesService.list({
      type,
      category,
      q,
      limit: limit ? Number(limit) : 200,
    });
  }

  @Get('stats')
  stats(): Promise<unknown> {
    return this.expensesService.stats();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<unknown> {
    return this.expensesService.getById(id);
  }

  @Post()
  create(@Body() body: CreateExpenseDto): Promise<unknown> {
    return this.expensesService.create(body);
  }

  @Patch()
  update(@Body() body: UpdateExpenseDto): Promise<unknown> {
    return this.expensesService.update(body);
  }

  @Delete()
  delete(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.expensesService.delete(body.id);
  }
}