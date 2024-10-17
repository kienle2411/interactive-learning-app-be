import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateChoiceDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isCorrectAnswer?: boolean;

  @IsOptional()
  @IsString()
  questionId?: string;
}
