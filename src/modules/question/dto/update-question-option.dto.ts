import { PartialType } from '@nestjs/swagger';
import { CreateQuestionOptionDto } from './create-question-option.dto';

export class UpdateQuestionOptionDto extends PartialType(
  CreateQuestionOptionDto,
) {
  option?: string;
  isCorrect?: boolean;
}
