import { SessionStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  description?: string;

  @IsEnum(SessionStatus)
  status: SessionStatus;

  @IsDateString()
  sessionDate: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  classroomId: string;
}
