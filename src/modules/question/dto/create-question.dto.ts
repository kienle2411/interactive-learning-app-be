import { LinkedType, QuestionType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  time: number;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;

  @IsString()
  @IsNotEmpty()
  linkedId: string;

  @IsEnum(LinkedType)
  @IsNotEmpty()
  linkedType: LinkedType;
}
