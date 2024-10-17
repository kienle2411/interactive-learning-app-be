import { IsOptional, IsString } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  groupName?: string;

  @IsOptional()
  @IsString()
  classroomId?: string;
}
