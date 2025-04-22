import { IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  userId?: string;
}
