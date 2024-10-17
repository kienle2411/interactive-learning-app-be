import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAnswerDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @IsOptional()
  @IsString()
  selectedOptionId?: string;
}
