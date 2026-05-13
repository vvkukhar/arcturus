import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { OpenAiService } from './openai.service';
import { AiSuggestionsService } from './ai-suggestions.service';
import { DealExplanationService } from './deal-explanation.service';

@Module({
  imports: [AuthModule],
  controllers: [AiController],
  providers: [AiService, OpenAiService, AiSuggestionsService, DealExplanationService],
  exports: [AiService, OpenAiService, AiSuggestionsService, DealExplanationService],
})
export class AiModule {}