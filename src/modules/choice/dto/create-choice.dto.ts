import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateChoiceDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrectAnswer: boolean;

  @IsNotEmpty()
  @IsString()
  questionId: string;
}
