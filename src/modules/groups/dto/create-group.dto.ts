import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  groupName: string;
}
