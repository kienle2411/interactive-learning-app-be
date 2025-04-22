import { CreateAnswerDto } from '@/modules/answer/dto/create-answer.dto';
import { Type } from 'class-transformer';
import { IsArray, Validate, ValidateNested } from 'class-validator';

export class CreateAssignmentSubmissionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}
