import { LinkedType, QuestionType } from '@prisma/client';
import { Exclude } from 'class-transformer';
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
  @IsOptional()
  timeLimit?: number;

  @IsNumber()
  @IsOptional()
  score?: number;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;

  @IsString()
  @IsNotEmpty()
  @Exclude()
  linkedId: string;

  @IsEnum(LinkedType)
  @IsNotEmpty()
  @Exclude()
  linkedType: LinkedType;
}
