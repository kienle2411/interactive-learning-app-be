import { IsOptional, IsString } from 'class-validator';

export class UpdateTeacherDto {
  @IsOptional()
  @IsString()
  subjectSpecialization?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
