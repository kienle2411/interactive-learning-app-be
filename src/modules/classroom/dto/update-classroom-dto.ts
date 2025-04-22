import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateClassroomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}
