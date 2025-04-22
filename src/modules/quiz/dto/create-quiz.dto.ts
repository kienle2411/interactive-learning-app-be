import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @IsNumber()
  @IsNotEmpty()
  timeLimit: number;
}
