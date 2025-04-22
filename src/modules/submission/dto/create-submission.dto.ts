import { SubmissionStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;
}
