import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  docFileId: string;

  @IsString()
  @IsNotEmpty()
  classroomId: string;
}
