import { Module } from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { ChoiceController } from './choice.controller';

@Module({
  providers: [ChoiceService],
  controllers: [ChoiceController]
})
export class ChoiceModule {}
