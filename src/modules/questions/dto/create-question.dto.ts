import { QuestionType, ResponseType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  questionType: QuestionType;

  @IsEnum(ResponseType)
  responseType: ResponseType;

  @IsString()
  @IsNotEmpty()
  questionTitle: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsDateString()
  timeResponse?: number;

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
