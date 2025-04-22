import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionOptionDto {
  @IsString()
  @IsNotEmpty()
  option: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;
}
