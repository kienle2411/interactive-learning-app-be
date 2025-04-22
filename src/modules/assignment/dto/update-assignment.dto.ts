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
  @IsString()
  classroomId?: string;
}
