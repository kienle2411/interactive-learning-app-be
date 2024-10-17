import { MediaType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsEnum(MediaType)
  type: MediaType;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  questionId?: string;
}
