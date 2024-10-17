import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeacherDto {
  @IsOptional()
  @IsString()
  subjectSpecialization?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
