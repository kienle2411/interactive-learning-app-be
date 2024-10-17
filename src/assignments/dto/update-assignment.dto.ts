import { AssignmentType } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateAssignmentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  dueTime?: string;

  @IsOptional()
  @IsEnum(AssignmentType)
  assignmentType?: AssignmentType;

  @IsOptional()
  @IsString()
  classroomId?: string;
}
