import { SubmissionStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateSubmissionDto {
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsString()
  score?: number;
}
