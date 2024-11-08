import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  questionId: string;

  @IsOptional()
  @IsString()
  selectedOptionId?: string;
}
