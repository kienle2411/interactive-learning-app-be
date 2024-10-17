import { AssignmentType } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  dueTime: string;

  @IsNotEmpty()
  @IsEnum(AssignmentType)
  assignmentType: AssignmentType;

  @IsNotEmpty()
  @IsString()
  classroomId: string;
}
