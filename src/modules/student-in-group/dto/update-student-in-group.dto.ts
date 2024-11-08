import { IsOptional, IsString } from 'class-validator';

export class UpdateStudentInGroupDto {
  @IsOptional()
  @IsString()
  studentId?: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsOptional()
  @IsString()
  classroomId?: string;
}
