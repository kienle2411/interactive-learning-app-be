import { SubmissionStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @IsNotEmpty()
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;

  @IsNotEmpty()
  @IsString()
  assignmentId: string;
}
