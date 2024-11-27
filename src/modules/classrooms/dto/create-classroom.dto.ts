import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateClassroomDto {
  @IsString()
  @IsNotEmpty()
  classroomName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsNotEmpty()
  capacity: number;

  @IsString()
  @IsNotEmpty()
  classroomCode: string;
}
