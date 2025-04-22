import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;
}
