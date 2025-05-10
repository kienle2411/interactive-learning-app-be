import { AnswerSource } from '@/common/utils/answer-source';
import { Answer, AnswerType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  contextId: string;

  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsEnum(AnswerType)
  @IsNotEmpty()
  type: AnswerType;

  @IsString()
  @IsOptional()
  text?: string;

  @IsOptional()
  @IsString()
  selectedOptionId?: string;

  @IsNotEmpty()
  answerSource: AnswerSource;
}
