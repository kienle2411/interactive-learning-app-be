import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStudentInClassroomDto {
  @IsOptional()
  @IsString()
  studentId?: string;

  @IsOptional()
  @IsString()
  classrooomId?: string;

  @IsOptional()
  @IsNumber()
  totalScore?: number;
}
