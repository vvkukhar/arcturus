import { Controller, Get } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';

@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly service: SuggestionsService) {}

  @Get('buy')
  getBuy() {
    return this.service.getBuySuggestions();
  }

  @Get('sell')
  getSell() {
    return this.service.getSellSuggestions();
  }
}