import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateClassroomDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  classroomName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsString()
  @IsNotEmpty()
  classroomCode: string;

  @IsString()
  @IsNotEmpty()
  teacherId: string;
}
