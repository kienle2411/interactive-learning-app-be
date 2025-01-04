import { QuestionType, ResponseType } from '@prisma/client';
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
  @IsEnum(QuestionType)
  questionType: QuestionType;

  @IsEnum(ResponseType)
  @IsOptional()
  responseType?: ResponseType;

  @IsString()
  @IsNotEmpty()
  questionTitle: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  timeResponse?: number;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsInt()
  orderInSlide: number;

  @IsOptional()
  @IsString()
  assignmentId?: string;

  @IsOptional()
  @IsString()
  docFileId?: string;
}
